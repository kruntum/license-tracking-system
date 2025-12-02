import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/server';

// Helper: Get notification count this month
async function getNotificationCountThisMonth() {
  const supabase = getServiceSupabase();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('notification_logs')
    .select('*', { count: 'exact', head: true })
    .gte('sent_at', startOfMonth.toISOString())
    .eq('status', 'success');

  return count || 0;
}

// Helper: Determine notification type
function getNotificationType(daysRemaining: number): string {
  if (daysRemaining <= 15) return '15_days';
  if (daysRemaining <= 30) return '30_days';
  if (daysRemaining <= 45) return '45_days';
  if (daysRemaining <= 90) return '90_days';
  return 'manual';
}

// Helper: Format message
function formatMessage(licenses: any[], type: string): string {
  const emoji = type === '15_days' ? '🔴' : type === '30_days' ? '🟠' : type === '45_days' ? '🟡' : '🔵';
  const urgency = type === '15_days' ? 'ด่วนมาก!' : type === '30_days' ? 'แจ้งเตือน' : type === '45_days' ? 'แจ้งเตือนล่วงหน้า' : 'แจ้งเตือนล่วงหน้า (90 วัน)';

  let message = `${emoji} ${urgency}: ใบอนุญาตใกล้หมดอายุ\n\n`;

  licenses.forEach((license, index) => {
    const validUntilDate = new Date(license.valid_until);
    const dateStr = !isNaN(validUntilDate.getTime())
      ? validUntilDate.toLocaleDateString('th-TH')
      : license.valid_until || 'ไม่ระบุวันที่';

    message += `${index + 1}. ${license.registration_no}\n`;
    message += `   บริษัท: ${license.company_name || 'ไม่ระบุ'}\n`;
    message += `   ประเภท: ${license.tag_name || '-'}\n`;
    message += `   หมดอายุ: ${dateStr}\n`;
    message += `   เหลือ: ${license.days_remaining} วัน\n\n`;
  });

  if (type === '15_days') {
    message += '⚠️ กรุณาดำเนินการต่ออายุทันที!';
  } else if (type === '30_days') {
    message += '📌 ควรเตรียมการต่ออายุ';
  }

  return message.trim();
}

export async function GET(req: NextRequest) {
  // Security: Validate Cron Secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const supabase = getServiceSupabase();

    // Check quota first
    const monthlyCount = await getNotificationCountThisMonth();
    const MONTHLY_LIMIT = 300;

    if (monthlyCount >= MONTHLY_LIMIT) {
      console.warn('Monthly quota exceeded, skipping notifications');
      return NextResponse.json({
        success: false,
        error: 'quota_exceeded',
        quotaUsed: monthlyCount,
        quotaLimit: MONTHLY_LIMIT,
      });
    }

    // Query licenses expiring within 1-90 days
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 90);

    const { data: licenses, error } = await supabase
      .from('licenses')
      .select(`
        id,
        registration_no,
        valid_until,
        companies (name),
        tags (name)
      `)
      .lte('valid_until', futureDate.toISOString().split('T')[0])
      .order('valid_until', { ascending: true });

    if (error) throw error;

    if (!licenses || licenses.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No licenses found',
        processed: 0,
      });
    }

    // Calculate days remaining and filter out recently notified
    const licensesWithDays = await Promise.all(
      licenses.map(async (license: any) => {
        const validUntil = new Date(license.valid_until);
        const daysRemaining = Math.ceil(
          (validUntil.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        const notificationType = getNotificationType(daysRemaining);

        // Check if notified recently
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(today.getDate() - 15);

        const { data: recentLogs } = await supabase
          .from('notification_logs')
          .select('id')
          .eq('license_id', license.id)
          .eq('notification_type', notificationType)
          .eq('status', 'success')
          .gte('sent_at', fifteenDaysAgo.toISOString())
          .limit(1);

        const wasNotifiedRecently = recentLogs && recentLogs.length > 0;

        return {
          ...license,
          company_name: license.companies?.name,
          tag_name: license.tags?.name,
          days_remaining: daysRemaining,
          notification_type: notificationType,
          should_notify: !wasNotifiedRecently,
        };
      })
    );

    // Filter licenses that should be notified (1-90 days remaining only)
    const toNotify = licensesWithDays.filter((l) => l.should_notify && l.days_remaining >= 1 && l.days_remaining <= 90);

    if (toNotify.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All licenses already notified recently',
        processed: 0,
      });
    }

    // Group by notification type
    const grouped: Record<string, any[]> = {};
    toNotify.forEach((license) => {
      const type = license.notification_type;
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(license);
    });

    // Send notifications
    let messagesSent = 0;
    const logEntries = [];

    for (const [type, typedLicenses] of Object.entries(grouped)) {
      // For urgency (15 days), send individual messages
      // For others, batch them
      if (type === '15_days') {
        // Send individual messages for urgent cases
        for (const license of typedLicenses) {
          const message = formatMessage([license], type);

          const lineResponse = await fetch('https://api.line.me/v2/bot/message/broadcast', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
              messages: [{ type: 'text', text: message }],
            }),
          });

          const success = lineResponse.ok;
          messagesSent += success ? 1 : 0;

          logEntries.push({
            license_id: license.id,
            notification_type: type,
            status: success ? 'success' : 'failed',
            message_preview: message.substring(0, 200),
            error_message: success ? null : await lineResponse.text(),
          });
        }
      } else {
        // Batch send for non-urgent
        const message = formatMessage(typedLicenses, type);

        const lineResponse = await fetch('https://api.line.me/v2/bot/message/broadcast', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            messages: [{ type: 'text', text: message }],
          }),
        });

        const success = lineResponse.ok;
        messagesSent += success ? 1 : 0;

        // Log each license individually
        for (const license of typedLicenses) {
          logEntries.push({
            license_id: license.id,
            notification_type: type,
            status: success ? 'success' : 'failed',
            message_preview: message.substring(0, 200),
            error_message: success ? null : await lineResponse.text(),
          });
        }
      }
    }

    // Save logs
    if (logEntries.length > 0) {
      await supabase.from('notification_logs').insert(logEntries);
    }

    return NextResponse.json({
      success: true,
      processed: toNotify.length,
      messagesSent,
      quotaRemaining: MONTHLY_LIMIT - monthlyCount - messagesSent,
      licenses: toNotify.map((l) => ({
        registration_no: l.registration_no,
        days_remaining: l.days_remaining,
        type: l.notification_type,
      })),
    });
  } catch (error) {
    console.error('Cron Job Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/server';

// Helper to format date as YYYY-MM-DD for SQL comparison
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export async function GET(req: NextRequest) {
  // 1. Security Check: Validate Vercel Cron Secret
  // This prevents unauthorized users from triggering your notification blast
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const supabase = getServiceSupabase();
    const today = new Date();

    // Calculate Target Dates
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    // 2. Query Licenses (Bypassing RLS with Service Role)
    // We look for licenses expiring exactly in 30 days OR 7 days
    const { data: expiringLicenses, error } = await supabase
      .from('licenses')
      .select('*, license_categories(name)')
      .in('expire_date', [formatDate(next30Days), formatDate(next7Days)])
      .eq('status', 'Active'); // Only check active licenses

    if (error) throw error;

    if (!expiringLicenses || expiringLicenses.length === 0) {
      return NextResponse.json({ message: 'No licenses expiring today.' });
    }

    // 3. Send Notifications via LINE Messaging API
    // We will use 'broadcast' for this example (sends to all friends of the bot)
    // In a real app, you might want to send to specific users using 'push'

    const messages = expiringLicenses.map(license => {
      const daysLeft = license.expire_date === formatDate(next30Days) ? 30 : 7;
      return `⚠️ Warning: License Expiring!\n\nNo: ${license.license_number}\nCategory: ${license.license_categories?.name}\nExpires: ${license.expire_date}\n(${daysLeft} days remaining)`;
    });

    // Batch send to LINE (Broadcast)
    if (messages.length > 0) {
      // Note: LINE Broadcast allows max 5 messages at a time.
      // For simplicity, we join them into one big message or send individually.
      // Here we simulate sending a single summary message to avoid spamming.

      const summaryMessage = `🔔 Daily License Check\nFound ${messages.length} expiring licenses.\n\n` + messages.join('\n----------------\n');

      await fetch('https://api.line.me/v2/bot/message/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          messages: [
            {
              type: 'text',
              text: summaryMessage
            }
          ]
        })
      });
    }

    return NextResponse.json({
      success: true,
      processed: expiringLicenses.length,
      licenses: expiringLicenses.map(l => l.license_number)
    });

  } catch (error) {
    console.error('Cron Job Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
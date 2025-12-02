-- ============================================
-- Notification Logs Table - Migration Script
-- ============================================
-- Purpose: Track notification history to prevent duplicate alerts
-- ============================================

CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id UUID NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL CHECK (notification_type IN ('90_days', '45_days', '30_days', '15_days', 'manual')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending')),
    message_preview TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notification_logs_license_id ON notification_logs(license_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_sent_at ON notification_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_notification_logs_type ON notification_logs(notification_type);
CREATE INDEX IF NOT EXISTS idx_notification_logs_license_type_sent ON notification_logs(license_id, notification_type, sent_at DESC);

-- Helper Function: Check if notification was sent recently
CREATE OR REPLACE FUNCTION has_recent_notification(
    p_license_id UUID,
    p_notification_type TEXT,
    p_days_threshold INTEGER DEFAULT 15
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM notification_logs
        WHERE license_id = p_license_id
          AND notification_type = p_notification_type
          AND status = 'success'
          AND sent_at > NOW() - INTERVAL '1 day' * p_days_threshold
    );
END;
$$ LANGUAGE plpgsql;

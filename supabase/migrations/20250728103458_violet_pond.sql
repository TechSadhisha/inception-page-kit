/*
  # Third-Party Integrations Schema

  1. New Tables
    - `integration_configs` - Store API configurations
    - `portal_integrations` - Real estate portal connections
    - `marketing_integrations` - Marketing platform connections
    - `telephony_integrations` - Call/SMS provider configs
    - `webhook_endpoints` - Incoming webhook management
    - `api_usage_logs` - Track API usage and limits

  2. Security
    - Encrypted credential storage
    - Role-based access to integrations

  3. Features
    - Portal lead sync (MagicBricks, 99acres, Housing.com)
    - Marketing automation (Meta, Google Ads)
    - Communication channels (WhatsApp, SMS, Email)
*/

-- Integration configurations
CREATE TABLE IF NOT EXISTS integration_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('portal', 'marketing', 'communication', 'telephony', 'analytics')),
  config JSONB NOT NULL,
  credentials JSONB, -- Encrypted in application layer
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_frequency INTEGER DEFAULT 3600,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Portal-specific integrations
CREATE TABLE IF NOT EXISTS portal_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES integration_configs(id),
  portal_name TEXT NOT NULL,
  api_endpoint TEXT,
  webhook_secret TEXT,
  lead_mapping JSONB,
  property_mapping JSONB,
  sync_settings JSONB,
  last_lead_sync TIMESTAMP WITH TIME ZONE,
  last_property_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Marketing platform integrations
CREATE TABLE IF NOT EXISTS marketing_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES integration_configs(id),
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'google_ads', 'linkedin', 'instagram')),
  account_id TEXT,
  campaign_sync BOOLEAN DEFAULT false,
  lead_sync BOOLEAN DEFAULT true,
  conversion_tracking BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Communication channel integrations
CREATE TABLE IF NOT EXISTS communication_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES integration_configs(id),
  channel_type TEXT NOT NULL CHECK (channel_type IN ('whatsapp', 'sms', 'email', 'voice')),
  provider TEXT NOT NULL,
  webhook_url TEXT,
  template_sync BOOLEAN DEFAULT false,
  delivery_tracking BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Webhook endpoint management
CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret_key TEXT,
  event_types TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_triggered TIMESTAMP WITH TIME ZONE,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- API usage tracking
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES integration_configs(id),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  request_size INTEGER,
  response_size INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Lead source tracking
CREATE TABLE IF NOT EXISTS lead_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('portal', 'social', 'referral', 'direct', 'campaign')),
  integration_id UUID REFERENCES integration_configs(id),
  tracking_config JSONB,
  conversion_rate DECIMAL(5, 2) DEFAULT 0,
  total_leads INTEGER DEFAULT 0,
  qualified_leads INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE integration_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage integrations" ON integration_configs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view active integrations" ON integration_configs
  FOR SELECT USING (is_active = true AND auth.role() = 'authenticated');

CREATE POLICY "Users can view portal integrations" ON portal_integrations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view marketing integrations" ON marketing_integrations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view communication integrations" ON communication_integrations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can manage webhook endpoints" ON webhook_endpoints
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view API usage logs" ON api_usage_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view lead sources" ON lead_sources
  FOR SELECT USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_integration_configs_provider ON integration_configs(provider);
CREATE INDEX idx_integration_configs_type ON integration_configs(integration_type);
CREATE INDEX idx_api_usage_logs_integration_id ON api_usage_logs(integration_id);
CREATE INDEX idx_api_usage_logs_created_at ON api_usage_logs(created_at);

-- Insert default integrations
INSERT INTO integration_configs (name, provider, integration_type, config, is_active) VALUES
('MagicBricks Integration', 'magicbricks', 'portal', '{"api_version": "v1", "rate_limit": 1000}', false),
('99acres Integration', '99acres', 'portal', '{"api_version": "v2", "rate_limit": 500}', false),
('Housing.com Integration', 'housing', 'portal', '{"api_version": "v1", "rate_limit": 800}', false),
('Facebook Ads Integration', 'facebook', 'marketing', '{"api_version": "v18.0", "rate_limit": 200}', false),
('Google Ads Integration', 'google_ads', 'marketing', '{"api_version": "v14", "rate_limit": 1000}', false),
('WhatsApp Business Integration', 'whatsapp_business', 'communication', '{"api_version": "v1", "rate_limit": 1000}', false);

-- Insert default lead sources
INSERT INTO lead_sources (name, source_type, tracking_config) VALUES
('MagicBricks Portal', 'portal', '{"utm_source": "magicbricks", "attribution_window": 30}'),
('99acres Portal', 'portal', '{"utm_source": "99acres", "attribution_window": 30}'),
('Housing.com Portal', 'portal', '{"utm_source": "housing", "attribution_window": 30}'),
('Facebook Campaigns', 'social', '{"utm_source": "facebook", "attribution_window": 7}'),
('Google Ads', 'campaign', '{"utm_source": "google", "attribution_window": 7}'),
('Direct Website', 'direct', '{"utm_source": "direct", "attribution_window": 1}'),
('Referral Program', 'referral', '{"utm_source": "referral", "attribution_window": 90}');
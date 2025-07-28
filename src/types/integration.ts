export interface IntegrationConfig {
  id: string
  name: string
  provider: string
  integration_type: 'portal' | 'marketing' | 'communication' | 'telephony' | 'analytics'
  config: Record<string, any>
  credentials?: Record<string, any>
  is_active: boolean
  last_sync_at?: string
  sync_frequency: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface PortalIntegration {
  id: string
  integration_id: string
  portal_name: string
  api_endpoint?: string
  webhook_secret?: string
  lead_mapping?: Record<string, any>
  property_mapping?: Record<string, any>
  sync_settings?: Record<string, any>
  last_lead_sync?: string
  last_property_sync?: string
  created_at: string
}

export interface MarketingIntegration {
  id: string
  integration_id: string
  platform: 'facebook' | 'google_ads' | 'linkedin' | 'instagram'
  account_id?: string
  campaign_sync: boolean
  lead_sync: boolean
  conversion_tracking: boolean
  created_at: string
}

export interface CommunicationIntegration {
  id: string
  integration_id: string
  channel_type: 'whatsapp' | 'sms' | 'email' | 'voice'
  provider: string
  webhook_url?: string
  template_sync: boolean
  delivery_tracking: boolean
  created_at: string
}

export interface WebhookEndpoint {
  id: string
  name: string
  url: string
  secret_key?: string
  event_types: string[]
  is_active: boolean
  last_triggered?: string
  success_count: number
  failure_count: number
  created_at: string
}

export interface ApiUsageLog {
  id: string
  integration_id: string
  endpoint: string
  method: string
  status_code?: number
  response_time_ms?: number
  request_size?: number
  response_size?: number
  error_message?: string
  created_at: string
}

export interface LeadSource {
  id: string
  name: string
  source_type: 'portal' | 'social' | 'referral' | 'direct' | 'campaign'
  integration_id?: string
  tracking_config?: Record<string, any>
  conversion_rate: number
  total_leads: number
  qualified_leads: number
  is_active: boolean
  created_at: string
}
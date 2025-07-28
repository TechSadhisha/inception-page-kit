
import { supabase } from '@/integrations/supabase/client'

export interface MetaAdAccount {
  id: string
  name: string
  account_status: number
}

export class MetaApiClient {
  private baseUrl = 'https://graph.facebook.com/v18.0'
  private accessToken: string
  private adAccountId: string

  constructor(accessToken: string, adAccountId: string) {
    this.accessToken = accessToken
    this.adAccountId = adAccountId
  }

  get apiBaseUrl() {
    return this.baseUrl
  }

  get token() {
    return this.accessToken
  }

  get accountId() {
    return this.adAccountId
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/me/adaccounts?access_token=${this.accessToken}`)
      const data = await response.json()
      return !data.error
    } catch (error) {
      console.error('Meta API connection test failed:', error)
      return false
    }
  }

  async getAdAccounts(): Promise<MetaAdAccount[]> {
    try {
      const response = await fetch(`${this.baseUrl}/me/adaccounts?fields=id,name,account_status&access_token=${this.accessToken}`)
      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Failed to fetch ad accounts:', error)
      return []
    }
  }

  async makeApiRequest(endpoint: string, method: 'GET' | 'POST', body?: any) {
    const url = `${this.baseUrl}/${endpoint}`
    const options: RequestInit = {
      method,
      headers: method === 'POST' ? { 'Content-Type': 'application/json' } : undefined
    }

    if (method === 'POST' && body) {
      options.body = JSON.stringify({
        access_token: this.accessToken,
        ...body
      })
    } else if (method === 'GET') {
      const params = new URLSearchParams({ access_token: this.accessToken })
      return fetch(`${url}?${params}`)
    }

    return fetch(url, options)
  }
}

export const createMetaApiClient = async (): Promise<MetaApiClient | null> => {
  try {
    // First try to get from Facebook integration (OAuth)
    const { data: facebookIntegration } = await supabase
      .from('facebook_integrations')
      .select('access_token, ad_account_id')
      .eq('is_active', true)
      .single()

    if (facebookIntegration?.access_token && facebookIntegration?.ad_account_id) {
      return new MetaApiClient(facebookIntegration.access_token, facebookIntegration.ad_account_id)
    }

    // Fallback to legacy campaign_settings for backward compatibility
    const { data: settings } = await supabase
      .from('campaign_settings')
      .select('access_token, ad_account_id')
      .single()

    if (!settings?.access_token || !settings?.ad_account_id) {
      throw new Error('Meta credentials not configured')
    }

    return new MetaApiClient(settings.access_token, settings.ad_account_id)
  } catch (error) {
    console.error('Failed to create Meta API client:', error)
    return null
  }
}

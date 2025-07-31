import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface MetaCampaign {
  id: string
  campaign_id: string
  name: string
  status: string
  ad_account_id: string
  created_at: string
  updated_at: string
}

export interface MetaLead {
  id: string
  lead_id: string
  campaign_id: string
  campaign_name: string
  campaign_status: string
  ad_id: string
  ad_name: string
  lead_form_id: string
  created_time: string
  name?: string
  email?: string
  phone?: string
  raw_data?: any
  created_at: string
  updated_at: string
}

export interface CampaignLeadSummary {
  total_campaigns: number
  total_leads: number
  ad_account_id: string
}

export const useMetaCampaigns = () => {
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([])
  const [leads, setLeads] = useState<MetaLead[]>([])
  const [summary, setSummary] = useState<CampaignLeadSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const loadCachedData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load cached campaigns
      const { data: campaignsData } = await supabase
        .from('meta_campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      // Load cached leads
      const { data: leadsData } = await supabase
        .from('meta_leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_time', { ascending: false })

      if (campaignsData) setCampaigns(campaignsData)
      if (leadsData) setLeads(leadsData)

      if (campaignsData && leadsData) {
        setSummary({
          total_campaigns: campaignsData.length,
          total_leads: leadsData.length,
          ad_account_id: campaignsData[0]?.ad_account_id || ''
        })
      }
    } catch (err) {
      console.error('Error loading cached data:', err)
    }
  }

  const fetchCampaignsAndLeads = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Authentication required')
      }

      const response = await supabase.functions.invoke('fetch-campaigns-and-leads', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch campaigns and leads')
      }

      const { data } = response
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch campaigns and leads')
      }

      // Update state with fresh data
      setCampaigns(data.campaigns || [])
      setLeads(data.leads || [])
      setSummary(data.summary)

      toast({
        title: "Campaigns and Leads Updated",
        description: `Found ${data.summary.total_campaigns} campaigns and ${data.summary.total_leads} leads`,
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      toast({
        title: "Error Fetching Data",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    await fetchCampaignsAndLeads()
  }

  useEffect(() => {
    loadCachedData()
  }, [])

  return {
    campaigns,
    leads,
    summary,
    loading,
    error,
    fetchCampaignsAndLeads,
    refreshData,
    loadCachedData
  }
}
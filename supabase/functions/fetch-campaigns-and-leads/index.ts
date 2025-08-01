import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FacebookAdAccount {
  id: string
  name: string
}

interface FacebookCampaign {
  id: string
  name: string
}

interface FacebookAd {
  id: string
  name: string
  adcreatives?: {
    data: Array<{
      object_story_spec?: {
        link_data?: {
          leadgen_form_id?: string
        }
      }
    }>
  }
}

interface FacebookLead {
  id: string
  created_time: string
  field_data: Array<{
    name: string
    values: string[]
  }>
}

interface ProcessedLead {
  id: string
  campaign_id: string
  ad_id: string
  lead_form_id: string
  created_time: string
  name?: string
  email?: string
  phone?: string
  [key: string]: any
}

async function makeMetaApiCall(endpoint: string, accessToken: string) {
  const response = await fetch(`https://graph.facebook.com/v20.0${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  
  const responseText = await response.text()
  
  if (!response.ok) {
    let errorMessage = 'Unknown error'
    try {
      const error = JSON.parse(responseText)
      errorMessage = error.error?.message || 'Unknown error'
    } catch {
      errorMessage = `HTTP ${response.status}: ${responseText || 'No response body'}`
    }
    throw new Error(`Meta API Error: ${errorMessage}`)
  }
  
  if (!responseText) {
    throw new Error('Empty response from Meta API')
  }
  
  try {
    return JSON.parse(responseText)
  } catch (parseError) {
    throw new Error(`Invalid JSON response from Meta API: ${responseText}`)
  }
}

function parseLeadFields(fieldData: Array<{ name: string; values: string[] }>): Record<string, any> {
  const parsed: Record<string, any> = {}
  
  for (const field of fieldData) {
    const value = field.values?.[0] || ''
    
    // Map common field names
    switch (field.name.toLowerCase()) {
      case 'full_name':
      case 'first_name':
      case 'last_name':
        parsed.name = parsed.name ? `${parsed.name} ${value}` : value
        break
      case 'email':
        parsed.email = value
        break
      case 'phone_number':
      case 'phone':
        parsed.phone = value
        break
      default:
        parsed[field.name] = value
    }
  }
  
  return parsed
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header required')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Authentication failed')
    }

    // Parse request body for parameters
    const body = req.method === 'POST' ? await req.json() : {}
    const { action, ad_account_id, campaign_id, page_id } = body

    // If no action is specified, default to fetching all campaigns and leads
    const actionToPerform = action || 'get_all_data'

    // Get the user's Facebook integration
    const { data: integration, error: integrationError } = await supabase
      .from('facebook_integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (integrationError || !integration) {
      throw new Error('Facebook integration not found')
    }

    const { access_token: accessToken } = integration

    if (!accessToken) {
      throw new Error('Facebook access token not found')
    }

    // Step 1: Get Ad Accounts
    if (action === 'get_ad_accounts') {
      console.log('Fetching ad accounts')
      const adAccountsResponse = await makeMetaApiCall(
        '/me/adaccounts?fields=id,name',
        accessToken
      )
      
      const adAccounts: FacebookAdAccount[] = adAccountsResponse.data || []
      
      return new Response(
        JSON.stringify({
          success: true,
          ad_accounts: adAccounts
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Step 2: Get Campaigns for selected Ad Account
    if (action === 'get_campaigns' && ad_account_id) {
      console.log('Fetching campaigns for ad account:', ad_account_id)
      const campaignsResponse = await makeMetaApiCall(
        `/${ad_account_id}/campaigns?fields=id,name`,
        accessToken
      )
      
      const campaigns: FacebookCampaign[] = campaignsResponse.data || []
      
      return new Response(
        JSON.stringify({
          success: true,
          campaigns: campaigns
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Step 3: Get Ads for selected Campaign
    if (action === 'get_ads' && campaign_id) {
      console.log('Fetching ads for campaign:', campaign_id)
      const adsResponse = await makeMetaApiCall(
        `/${campaign_id}/ads?fields=id,name,adcreatives{object_story_spec}`,
        accessToken
      )
      
      const ads: FacebookAd[] = adsResponse.data || []
      
      return new Response(
        JSON.stringify({
          success: true,
          ads: ads
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Step 4: Get Leads for selected Campaign
    if (action === 'get_leads' && campaign_id) {
      console.log('Fetching leads for campaign:', campaign_id)
      
      // First get ads for this campaign
      const adsResponse = await makeMetaApiCall(
        `/${campaign_id}/ads?fields=id,name,adcreatives{object_story_spec}`,
        accessToken
      )

      const ads: FacebookAd[] = adsResponse.data || []
      const allLeads: ProcessedLead[] = []

      // Process each ad to find lead forms
      for (const ad of ads) {
        const creatives = ad.adcreatives?.data || []
        
        for (const creative of creatives) {
          const leadFormId = creative.object_story_spec?.link_data?.leadgen_form_id
          
          if (leadFormId) {
            console.log(`Found lead form ${leadFormId} for ad ${ad.name}`)
            
            try {
              // Fetch leads for this form
              const leadsResponse = await makeMetaApiCall(
                `/${leadFormId}/leads?fields=id,created_time,field_data`,
                accessToken
              )

              const leads: FacebookLead[] = leadsResponse.data || []
              console.log(`Found ${leads.length} leads for form ${leadFormId}`)

              // Process each lead
              for (const lead of leads) {
                const parsedFields = parseLeadFields(lead.field_data || [])
                
                const processedLead: ProcessedLead = {
                  id: lead.id,
                  campaign_id: campaign_id,
                  ad_id: ad.id,
                  lead_form_id: leadFormId,
                  created_time: lead.created_time,
                  ...parsedFields
                }

                allLeads.push(processedLead)
              }
            } catch (leadError) {
              console.error(`Error fetching leads for form ${leadFormId}:`, leadError)
            }
          }
        }
      }

      // Store leads in database
      if (allLeads.length > 0) {
        // Clear existing leads for this campaign
        await supabase.from('meta_leads').delete().eq('user_id', user.id).eq('campaign_id', campaign_id)
        
        const leadRecords = allLeads.map(lead => ({
          user_id: user.id,
          lead_id: lead.id,
          campaign_id: lead.campaign_id,
          ad_id: lead.ad_id,
          lead_form_id: lead.lead_form_id,
          created_time: lead.created_time,
          name: lead.name || null,
          email: lead.email || null,
          phone: lead.phone || null,
          raw_data: lead
        }))

        await supabase.from('meta_leads').insert(leadRecords)
      }

      return new Response(
        JSON.stringify({
          success: true,
          leads: allLeads,
          total_leads: allLeads.length
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Default action: Get all campaigns and leads
    if (actionToPerform === 'get_all_data') {
      console.log('Fetching all campaigns and leads')
      
      // Use the ad_account_id from integration if not provided
      const selectedAdAccountId = ad_account_id || integration.ad_account_id
      
      if (!selectedAdAccountId) {
        throw new Error('Ad account ID not found in integration')
      }

      // Get campaigns for the ad account
      console.log('Fetching campaigns for ad account:', selectedAdAccountId)
      const campaignsResponse = await makeMetaApiCall(
        `/${selectedAdAccountId}/campaigns?fields=id,name,status`,
        accessToken
      )

      const campaigns: FacebookCampaign[] = campaignsResponse.data || []
      const allLeads: ProcessedLead[] = []
      let totalCampaigns = 0

      // Store campaigns in database
      if (campaigns.length > 0) {
        // Clear existing campaigns for this user
        await supabase.from('meta_campaigns').delete().eq('user_id', user.id)
        
        const campaignRecords = campaigns.map(campaign => ({
          user_id: user.id,
          campaign_id: campaign.id,
          name: campaign.name,
          status: (campaign as any).status || 'UNKNOWN',
          ad_account_id: selectedAdAccountId
        }))

        await supabase.from('meta_campaigns').insert(campaignRecords)
        totalCampaigns = campaigns.length
      }

      // For each campaign, get leads
      for (const campaign of campaigns) {
        console.log(`Fetching leads for campaign: ${campaign.name}`)
        
        try {
          // Get ads for this campaign
          const adsResponse = await makeMetaApiCall(
            `/${campaign.id}/ads?fields=id,name,adcreatives{object_story_spec}`,
            accessToken
          )

          const ads: FacebookAd[] = adsResponse.data || []

          // Process each ad to find lead forms
          for (const ad of ads) {
            const creatives = ad.adcreatives?.data || []
            
            for (const creative of creatives) {
              const leadFormId = creative.object_story_spec?.link_data?.leadgen_form_id
              
              if (leadFormId) {
                try {
                  // Fetch leads for this form
                  const leadsResponse = await makeMetaApiCall(
                    `/${leadFormId}/leads?fields=id,created_time,field_data`,
                    accessToken
                  )

                  const leads: FacebookLead[] = leadsResponse.data || []

                  // Process each lead
                  for (const lead of leads) {
                    const parsedFields = parseLeadFields(lead.field_data || [])
                    
                    const processedLead: ProcessedLead = {
                      id: lead.id,
                      campaign_id: campaign.id,
                      ad_id: ad.id,
                      lead_form_id: leadFormId,
                      created_time: lead.created_time,
                      ...parsedFields
                    }

                    allLeads.push(processedLead)
                  }
                } catch (leadError) {
                  console.error(`Error fetching leads for form ${leadFormId}:`, leadError)
                }
              }
            }
          }
        } catch (campaignError) {
          console.error(`Error fetching data for campaign ${campaign.name}:`, campaignError)
        }
      }

      // Store leads in database
      if (allLeads.length > 0) {
        // Clear existing leads for this user
        await supabase.from('meta_leads').delete().eq('user_id', user.id)
        
        const leadRecords = allLeads.map(lead => {
          const campaign = campaigns.find(c => c.id === lead.campaign_id)
          return {
            user_id: user.id,
            lead_id: lead.id,
            campaign_id: lead.campaign_id,
            campaign_name: campaign?.name || 'Unknown',
            campaign_status: (campaign as any)?.status || 'UNKNOWN',
            ad_id: lead.ad_id,
            ad_name: `Ad ${lead.ad_id}`,
            lead_form_id: lead.lead_form_id,
            created_time: lead.created_time,
            name: lead.name || null,
            email: lead.email || null,
            phone: lead.phone || null,
            raw_data: lead
          }
        })

        await supabase.from('meta_leads').insert(leadRecords)
      }

      return new Response(
        JSON.stringify({
          success: true,
          campaigns: campaigns,
          leads: allLeads,
          summary: {
            total_campaigns: totalCampaigns,
            total_leads: allLeads.length,
            ad_account_id: selectedAdAccountId
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    throw new Error('Invalid action or missing parameters')

  } catch (error) {
    console.error('Error in fetch-campaigns-and-leads:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
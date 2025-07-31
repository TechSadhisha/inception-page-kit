import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FacebookCampaign {
  id: string
  name: string
  status: string
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
  campaign_name: string
  campaign_status: string
  ad_id: string
  ad_name: string
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
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Meta API Error: ${error.error?.message || 'Unknown error'}`)
  }
  
  return await response.json()
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

    const { access_token: accessToken, ad_account_id: adAccountId } = integration

    if (!accessToken || !adAccountId) {
      throw new Error('Facebook integration incomplete')
    }

    console.log('Fetching campaigns for ad account:', adAccountId)

    // Fetch all campaigns
    const campaignsResponse = await makeMetaApiCall(
      `/act_${adAccountId}/campaigns?fields=id,name,status&limit=100`,
      accessToken
    )

    const campaigns: FacebookCampaign[] = campaignsResponse.data || []
    console.log(`Found ${campaigns.length} campaigns`)

    const allLeads: ProcessedLead[] = []

    // Process each campaign
    for (const campaign of campaigns) {
      console.log(`Processing campaign: ${campaign.name} (${campaign.id})`)

      try {
        // Fetch ads for this campaign
        const adsResponse = await makeMetaApiCall(
          `/${campaign.id}/ads?fields=id,name,adcreatives&limit=100`,
          accessToken
        )

        const ads: FacebookAd[] = adsResponse.data || []
        console.log(`Found ${ads.length} ads for campaign ${campaign.name}`)

        // Process each ad
        for (const ad of ads) {
          try {
            // Check if this ad has lead forms
            const creatives = ad.adcreatives?.data || []
            
            for (const creative of creatives) {
              const leadFormId = creative.object_story_spec?.link_data?.leadgen_form_id
              
              if (leadFormId) {
                console.log(`Found lead form ${leadFormId} for ad ${ad.name}`)
                
                try {
                  // Fetch leads for this form
                  const leadsResponse = await makeMetaApiCall(
                    `/${leadFormId}/leads?fields=id,created_time,field_data&limit=100`,
                    accessToken
                  )

                  const leads: FacebookLead[] = leadsResponse.data || []
                  console.log(`Found ${leads.length} leads for form ${leadFormId}`)

                  // Process each lead
                  for (const lead of leads) {
                    const parsedFields = parseLeadFields(lead.field_data || [])
                    
                    const processedLead: ProcessedLead = {
                      id: lead.id,
                      campaign_id: campaign.id,
                      campaign_name: campaign.name,
                      campaign_status: campaign.status,
                      ad_id: ad.id,
                      ad_name: ad.name,
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
          } catch (adError) {
            console.error(`Error processing ad ${ad.id}:`, adError)
          }
        }
      } catch (campaignError) {
        console.error(`Error processing campaign ${campaign.id}:`, campaignError)
      }
    }

    console.log(`Total leads processed: ${allLeads.length}`)

    // Store campaigns and leads in database for caching
    // First, clear existing data for this user
    await supabase.from('meta_campaigns').delete().eq('user_id', user.id)
    await supabase.from('meta_leads').delete().eq('user_id', user.id)

    // Store campaigns
    if (campaigns.length > 0) {
      const campaignRecords = campaigns.map(campaign => ({
        user_id: user.id,
        campaign_id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        ad_account_id: adAccountId
      }))

      await supabase.from('meta_campaigns').insert(campaignRecords)
    }

    // Store leads
    if (allLeads.length > 0) {
      const leadRecords = allLeads.map(lead => ({
        user_id: user.id,
        lead_id: lead.id,
        campaign_id: lead.campaign_id,
        campaign_name: lead.campaign_name,
        campaign_status: lead.campaign_status,
        ad_id: lead.ad_id,
        ad_name: lead.ad_name,
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
        campaigns: campaigns,
        leads: allLeads,
        summary: {
          total_campaigns: campaigns.length,
          total_leads: allLeads.length,
          ad_account_id: adAccountId
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

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
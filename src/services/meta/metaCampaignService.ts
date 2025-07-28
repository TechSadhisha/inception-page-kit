
import { MetaApiClient } from './metaApiClient'

interface MetaCampaignData {
  name: string
  objective: string
  status: 'ACTIVE' | 'PAUSED'
  daily_budget?: number
  lifetime_budget?: number
  targeting: {
    geo_locations: {
      countries?: string[]
      cities?: Array<{ key: string; name: string }>
    }
    age_min?: number
    age_max?: number
    genders?: number[]
    interests?: Array<{ id: string; name: string }>
  }
  creative: {
    title: string
    body: string
    image_hash?: string
  }
}

export class MetaCampaignService {
  constructor(private apiClient: MetaApiClient) {}

  async createCampaign(campaignData: MetaCampaignData): Promise<{ success: boolean; campaignId?: string; error?: string }> {
    try {
      // Step 1: Create Campaign
      const campaignResult = await this.createCampaignStep(campaignData)
      if (campaignResult.error) {
        return { success: false, error: campaignResult.error }
      }

      // Step 2: Create Ad Set
      const adSetResult = await this.createAdSetStep(campaignResult.id, campaignData)
      if (adSetResult.error) {
        return { success: false, error: adSetResult.error }
      }

      // Step 3: Create Ad Creative
      const creativeResult = await this.createAdCreativeStep(campaignData)
      if (creativeResult.error) {
        return { success: false, error: creativeResult.error }
      }

      // Step 4: Create Ad
      const adResult = await this.createAdStep(adSetResult.id, creativeResult.id, campaignData.name)
      if (adResult.error) {
        return { success: false, error: adResult.error }
      }

      return { success: true, campaignId: campaignResult.id }
    } catch (error) {
      console.error('Campaign creation failed:', error)
      return { success: false, error: 'Failed to create campaign' }
    }
  }

  private async createCampaignStep(campaignData: MetaCampaignData) {
    const response = await this.apiClient.makeApiRequest(`act_${this.apiClient.accountId}/campaigns`, 'POST', {
      name: campaignData.name,
      objective: this.mapObjective(campaignData.objective),
      status: campaignData.status,
      daily_budget: campaignData.daily_budget ? campaignData.daily_budget * 100 : undefined, // Convert to cents
    })

    return await response.json()
  }

  private async createAdSetStep(campaignId: string, campaignData: MetaCampaignData) {
    const response = await this.apiClient.makeApiRequest(`act_${this.apiClient.accountId}/adsets`, 'POST', {
      name: `${campaignData.name} - Ad Set`,
      campaign_id: campaignId,
      daily_budget: campaignData.daily_budget ? campaignData.daily_budget * 100 : undefined,
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'REACH',
      targeting: JSON.stringify(campaignData.targeting),
      status: campaignData.status,
    })

    return await response.json()
  }

  private async createAdCreativeStep(campaignData: MetaCampaignData) {
    const response = await this.apiClient.makeApiRequest(`act_${this.apiClient.accountId}/adcreatives`, 'POST', {
      name: `${campaignData.name} - Creative`,
      object_story_spec: JSON.stringify({
        page_id: this.apiClient.accountId,
        link_data: {
          message: campaignData.creative.body,
          name: campaignData.creative.title,
          image_hash: campaignData.creative.image_hash,
        }
      })
    })

    return await response.json()
  }

  private async createAdStep(adSetId: string, creativeId: string, campaignName: string) {
    const response = await this.apiClient.makeApiRequest(`act_${this.apiClient.accountId}/ads`, 'POST', {
      name: `${campaignName} - Ad`,
      adset_id: adSetId,
      creative: JSON.stringify({ creative_id: creativeId }),
      status: 'PAUSED',
    })

    return await response.json()
  }

  private mapObjective(objective: string): string {
    const objectiveMap: { [key: string]: string } = {
      'Lead Generation': 'LEAD_GENERATION',
      'Traffic': 'LINK_CLICKS',
      'Brand Awareness': 'BRAND_AWARENESS',
      'Conversions': 'CONVERSIONS',
      'Engagement': 'ENGAGEMENT'
    }
    return objectiveMap[objective] || 'LINK_CLICKS'
  }
}

export type { MetaCampaignData }

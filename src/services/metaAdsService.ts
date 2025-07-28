
import { createMetaApiClient } from './meta/metaApiClient'
import { MetaImageService } from './meta/metaImageService'
import { MetaCampaignService, MetaCampaignData } from './meta/metaCampaignService'

interface MetaAdAccount {
  id: string
  name: string
  account_status: number
}

export class MetaAdsService {
  private imageService: MetaImageService
  private campaignService: MetaCampaignService

  constructor(
    private apiClient: any,
    imageService: MetaImageService,
    campaignService: MetaCampaignService
  ) {
    this.imageService = imageService
    this.campaignService = campaignService
  }

  async testConnection(): Promise<boolean> {
    return this.apiClient.testConnection()
  }

  async getAdAccounts(): Promise<MetaAdAccount[]> {
    return this.apiClient.getAdAccounts()
  }

  async uploadImage(imageFile: File): Promise<string | null> {
    return this.imageService.uploadImage(imageFile)
  }

  async createCampaign(campaignData: MetaCampaignData): Promise<{ success: boolean; campaignId?: string; error?: string }> {
    return this.campaignService.createCampaign(campaignData)
  }
}

export const createMetaAdsService = async (): Promise<MetaAdsService | null> => {
  try {
    const apiClient = await createMetaApiClient()
    if (!apiClient) {
      return null
    }

    const imageService = new MetaImageService(apiClient)
    const campaignService = new MetaCampaignService(apiClient)

    return new MetaAdsService(apiClient, imageService, campaignService)
  } catch (error) {
    console.error('Failed to create Meta Ads service:', error)
    return null
  }
}

export type { MetaCampaignData, MetaAdAccount }

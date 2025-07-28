
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createMetaAdsService } from '@/services/metaAdsService'

interface CampaignToPublish {
  name: string
  platform: 'facebook' | 'instagram' | 'both'
  budget: number
  objective: string
  locations: string[]
  ageMin: string
  ageMax: string
  interests: string[]
  gender: string
  headline: string
  adDescription: string
  images: File[]
}

export const usePublishCampaign = () => {
  const [isPublishing, setIsPublishing] = useState(false)
  const { toast } = useToast()

  const publishToMeta = async (campaign: CampaignToPublish) => {
    setIsPublishing(true)
    
    try {
      const metaService = await createMetaAdsService()
      if (!metaService) {
        throw new Error('Meta Ads service not available. Please check your Meta Business settings.')
      }

      // Test connection first
      const isConnected = await metaService.testConnection()
      if (!isConnected) {
        throw new Error('Failed to connect to Meta Ads API. Please check your access token.')
      }

      // Upload images
      let imageHash = null
      if (campaign.images.length > 0) {
        imageHash = await metaService.uploadImage(campaign.images[0])
        if (!imageHash) {
          console.warn('Image upload failed, proceeding without image')
        }
      }

      // Prepare campaign data
      const metaCampaignData = {
        name: campaign.name,
        objective: campaign.objective,
        status: 'PAUSED' as const, // Start paused for safety
        daily_budget: campaign.budget,
        targeting: {
          geo_locations: {
            countries: ['IN'], // Defaulting to India based on the cities in your app
          },
          age_min: parseInt(campaign.ageMin),
          age_max: parseInt(campaign.ageMax),
          genders: campaign.gender === 'male' ? [1] : campaign.gender === 'female' ? [2] : [1, 2],
          interests: campaign.interests.map(interest => ({ id: '', name: interest }))
        },
        creative: {
          title: campaign.headline,
          body: campaign.adDescription,
          image_hash: imageHash
        }
      }

      // Create campaign
      const result = await metaService.createCampaign(metaCampaignData)
      
      if (result.success) {
        toast({
          title: "Campaign Published Successfully!",
          description: `Your campaign "${campaign.name}" has been created on Meta Ads Manager (Status: Paused for review)`,
        })
        return { success: true, campaignId: result.campaignId }
      } else {
        throw new Error(result.error || 'Failed to publish campaign')
      }
    } catch (error) {
      console.error('Publish campaign error:', error)
      toast({
        title: "Publish Failed",
        description: error instanceof Error ? error.message : 'Failed to publish campaign to Meta',
        variant: "destructive",
      })
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    } finally {
      setIsPublishing(false)
    }
  }

  return {
    publishToMeta,
    isPublishing
  }
}

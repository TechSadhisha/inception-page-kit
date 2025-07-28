
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface Campaign {
  id: string
  name: string
  platform: 'facebook' | 'instagram' | 'both'
  status: 'active' | 'paused' | 'draft'
  budget: number
  spent: number
  impressions: number
  clicks: number
  leads: number
  objective: string
  startDate: string
  endDate: string
  locations: string[]
  ageRange: { min: number; max: number }
  interests: string[]
  gender: string
  headline?: string
  description?: string
  images?: string[]
}

const initialCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Luxury Villa Promotion',
    platform: 'both',
    status: 'active',
    budget: 5000,
    spent: 2350,
    impressions: 45000,
    clicks: 890,
    leads: 23,
    objective: 'Lead Generation',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    locations: ['Mumbai', 'Delhi', 'Bangalore'],
    ageRange: { min: 25, max: 45 },
    interests: ['Real Estate', 'Luxury Homes', 'Investment'],
    gender: 'all',
    headline: 'Luxury Villas in Prime Locations',
    description: 'Discover premium villas with world-class amenities in the heart of the city.'
  },
  {
    id: '2',
    name: 'Apartment Rentals Campaign',
    platform: 'facebook',
    status: 'paused',
    budget: 3000,
    spent: 1200,
    impressions: 28000,
    clicks: 560,
    leads: 15,
    objective: 'Traffic',
    startDate: '2025-01-05',
    endDate: '2025-01-25',
    locations: ['Pune', 'Chennai'],
    ageRange: { min: 22, max: 35 },
    interests: ['Rental Properties', 'Apartments'],
    gender: 'all',
    headline: 'Modern Apartments for Rent',
    description: 'Find your perfect home with modern amenities and great connectivity.'
  }
]

export const useCampaigns = () => {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)

  const createCampaign = (campaignData: any) => {
    if (!campaignData.name || !campaignData.budget || !campaignData.objective || !campaignData.headline || !campaignData.adDescription) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including headline and ad description",
        variant: "destructive"
      })
      return false
    }

    if (campaignData.locations.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one location",
        variant: "destructive"
      })
      return false
    }

    if (campaignData.images.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image for your ad creative",
        variant: "destructive"
      })
      return false
    }

    const campaign: Campaign = {
      id: Date.now().toString(),
      name: campaignData.name,
      platform: campaignData.platform as 'facebook' | 'instagram' | 'both',
      status: 'draft',
      budget: parseInt(campaignData.budget),
      spent: 0,
      impressions: 0,
      clicks: 0,
      leads: 0,
      objective: campaignData.objective,
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
      locations: campaignData.locations,
      ageRange: { min: parseInt(campaignData.ageMin), max: parseInt(campaignData.ageMax) },
      interests: campaignData.interests,
      gender: campaignData.gender,
      headline: campaignData.headline,
      description: campaignData.adDescription,
      images: campaignData.images.map((file: File) => URL.createObjectURL(file))
    }

    setCampaigns(prev => [...prev, campaign])
    
    toast({
      title: "Campaign Created",
      description: "Your campaign has been created successfully with ad creative"
    })
    
    return true
  }

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === id 
        ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' }
        : campaign
    ))
  }

  return {
    campaigns,
    createCampaign,
    toggleCampaignStatus
  }
}

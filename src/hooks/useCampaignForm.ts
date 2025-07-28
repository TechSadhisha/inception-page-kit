
import { useState } from 'react'

export const useCampaignForm = () => {
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    platform: 'both',
    budget: '',
    objective: '',
    startDate: '',
    endDate: '',
    description: '',
    locations: [] as string[],
    ageMin: '18',
    ageMax: '65',
    interests: [] as string[],
    gender: 'all',
    headline: '',
    adDescription: '',
    images: [] as File[]
  })

  const resetForm = () => {
    setNewCampaign({
      name: '',
      platform: 'both',
      budget: '',
      objective: '',
      startDate: '',
      endDate: '',
      description: '',
      locations: [],
      ageMin: '18',
      ageMax: '65',
      interests: [],
      gender: 'all',
      headline: '',
      adDescription: '',
      images: []
    })
  }

  return {
    newCampaign,
    setNewCampaign,
    resetForm
  }
}

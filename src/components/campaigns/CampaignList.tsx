
import { CampaignCard } from './CampaignCard'

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

interface CampaignListProps {
  campaigns: Campaign[]
  onToggleStatus: (id: string) => void
}

export const CampaignList = ({ campaigns, onToggleStatus }: CampaignListProps) => {
  return (
    <div className="grid gap-4">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  )
}

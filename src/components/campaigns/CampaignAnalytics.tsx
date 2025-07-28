
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
}

interface CampaignAnalyticsProps {
  campaigns: Campaign[]
}

export const CampaignAnalytics = ({ campaigns }: CampaignAnalyticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{campaigns.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{campaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {campaigns.reduce((sum, c) => sum + c.leads, 0)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

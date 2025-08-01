import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building, Target, Users, TrendingUp } from 'lucide-react'

interface AdAccountSummaryProps {
  campaigns: any[]
  leads: any[]
  summary: any
}

export const AdAccountSummary = ({ campaigns, leads, summary }: AdAccountSummaryProps) => {
  const activeCampaigns = campaigns.filter(c => c.status?.toLowerCase() === 'active').length
  const pausedCampaigns = campaigns.filter(c => c.status?.toLowerCase() === 'paused').length
  
  const leadsThisMonth = leads.filter(lead => {
    const leadDate = new Date(lead.created_time)
    const now = new Date()
    return leadDate.getMonth() === now.getMonth() && leadDate.getFullYear() === now.getFullYear()
  }).length

  const adAccountName = summary?.ad_account_id?.replace('act_', '') || 'Unknown'

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Building className="h-4 w-4" />
            Ad Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold truncate">{adAccountName}</div>
          <p className="text-xs text-muted-foreground">
            Active Business Account
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{campaigns.length}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="default" className="text-xs">{activeCampaigns} Active</Badge>
            <Badge variant="secondary" className="text-xs">{pausedCampaigns} Paused</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{leads.length}</div>
          <p className="text-xs text-muted-foreground">
            {leadsThisMonth} this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">
            {campaigns.length > 0 ? Math.round(leads.length / campaigns.length * 10) / 10 : 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Avg leads per campaign
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
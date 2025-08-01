import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { MetaCampaign, MetaLead, CampaignLeadSummary } from '@/hooks/useMetaCampaigns'

interface CampaignSummaryProps {
  campaigns: MetaCampaign[]
  leads: MetaLead[]
  summary: CampaignLeadSummary | null
  loading: boolean
  onRefresh: () => void
}

export const CampaignSummary = ({ 
  campaigns, 
  leads, 
  summary, 
  loading, 
  onRefresh 
}: CampaignSummaryProps) => {
  const activeCampaigns = campaigns.filter(c => c.status.toLowerCase() === 'active').length
  const pausedCampaigns = campaigns.filter(c => c.status.toLowerCase() === 'paused').length
  const leadsThisMonth = leads.filter(lead => {
    const leadDate = new Date(lead.created_time)
    const now = new Date()
    return leadDate.getMonth() === now.getMonth() && leadDate.getFullYear() === now.getFullYear()
  }).length

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default'
      case 'paused':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{campaigns.length}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="default">{activeCampaigns} Active</Badge>
            <Badge variant="secondary">{pausedCampaigns} Paused</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
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
          <CardTitle className="text-sm font-medium">Ad Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-mono">
            {summary?.ad_account_id || 'Not connected'}
          </div>
          <p className="text-xs text-muted-foreground">
            Meta Business Account
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={onRefresh} 
            disabled={loading}
            variant="outline" 
            size="sm"
            className="w-full"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
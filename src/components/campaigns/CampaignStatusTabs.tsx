import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Search, Filter, Play, Pause } from 'lucide-react'
import { MetaCampaign } from '@/hooks/useMetaCampaigns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'

interface CampaignStatusTabsProps {
  campaigns: MetaCampaign[]
  loading?: boolean
}

export const CampaignStatusTabs = ({ campaigns, loading }: CampaignStatusTabsProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const activeCampaigns = campaigns.filter(c => c.status.toLowerCase() === 'active')
  const otherCampaigns = campaigns.filter(c => c.status.toLowerCase() !== 'active')

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default'
      case 'paused':
        return 'secondary'
      case 'archived':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Play className="h-3 w-3" />
      case 'paused':
        return <Pause className="h-3 w-3" />
      default:
        return null
    }
  }

  const filterCampaigns = (campaignList: MetaCampaign[]) => {
    return campaignList.filter(campaign =>
      !searchTerm || 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.campaign_id.includes(searchTerm)
    )
  }

  const exportToCSV = (campaignList: MetaCampaign[], filename: string) => {
    const headers = ['Campaign ID', 'Campaign Name', 'Status', 'Ad Account ID', 'Created At', 'Updated At']
    const csvContent = [
      headers.join(','),
      ...campaignList.map(campaign => [
        campaign.campaign_id,
        campaign.name,
        campaign.status,
        campaign.ad_account_id,
        format(new Date(campaign.created_at), 'yyyy-MM-dd HH:mm:ss'),
        format(new Date(campaign.updated_at), 'yyyy-MM-dd HH:mm:ss')
      ].map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  const CampaignTable = ({ campaigns: campaignList, title, emptyMessage }: { 
    campaigns: MetaCampaign[], 
    title: string,
    emptyMessage: string 
  }) => {
    const filteredCampaigns = filterCampaigns(campaignList)

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title} ({filteredCampaigns.length} total)</span>
            <Button 
              onClick={() => exportToCSV(filteredCampaigns, title.toLowerCase().replace(' ', '-'))} 
              variant="outline" 
              size="sm"
              disabled={filteredCampaigns.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {campaignList.length === 0 ? emptyMessage : 'No campaigns match your search'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Campaign ID</TableHead>
                    <TableHead>Ad Account</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {campaign.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(campaign.status)} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(campaign.status)}
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {campaign.campaign_id}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {campaign.ad_account_id}
                      </TableCell>
                      <TableCell>
                        {format(new Date(campaign.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(campaign.updated_at), 'MMM dd, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading campaigns...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="default">{activeCampaigns.length} Active</Badge>
          <Badge variant="secondary">{otherCampaigns.length} Other</Badge>
        </div>
      </div>

      {/* Campaign Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Active Campaigns ({activeCampaigns.length})
          </TabsTrigger>
          <TabsTrigger value="other" className="flex items-center gap-2">
            <Pause className="h-4 w-4" />
            Other Campaigns ({otherCampaigns.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <CampaignTable 
            campaigns={activeCampaigns} 
            title="Active Campaigns"
            emptyMessage="No active campaigns found"
          />
        </TabsContent>

        <TabsContent value="other">
          <CampaignTable 
            campaigns={otherCampaigns} 
            title="Other Campaigns"
            emptyMessage="No paused or archived campaigns found"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
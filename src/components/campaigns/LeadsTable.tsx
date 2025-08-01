import { useState } from 'react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Search, Filter } from 'lucide-react'
import { MetaLead, MetaCampaign } from '@/hooks/useMetaCampaigns'

interface LeadsTableProps {
  leads: MetaLead[]
  campaigns: MetaCampaign[]
  loading?: boolean
}

export const LeadsTable = ({ leads, campaigns, loading }: LeadsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [campaignFilter, setCampaignFilter] = useState<string>('all')

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
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

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.campaign_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || 
      lead.campaign_status.toLowerCase() === statusFilter.toLowerCase()

    const matchesCampaign = campaignFilter === 'all' || 
      lead.campaign_id === campaignFilter

    return matchesSearch && matchesStatus && matchesCampaign
  })

  const exportToCSV = () => {
    const headers = ['Lead Name', 'Email', 'Phone', 'Campaign Name', 'Campaign Status', 'Ad Name', 'Created Time']
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        lead.name || '',
        lead.email || '',
        lead.phone || '',
        lead.campaign_name,
        lead.campaign_status,
        lead.ad_name,
        format(new Date(lead.created_time), 'yyyy-MM-dd HH:mm:ss')
      ].map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `meta-leads-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  const uniqueCampaigns = campaigns.reduce((acc, campaign) => {
    if (!acc.find(c => c.campaign_id === campaign.campaign_id)) {
      acc.push(campaign)
    }
    return acc
  }, [] as MetaCampaign[])

  const uniqueStatuses = [...new Set(leads.map(lead => lead.campaign_status))]

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leads from Meta Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading leads...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Leads from Meta Campaigns ({filteredLeads.length} total)</span>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardTitle>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {uniqueStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {uniqueCampaigns.map(campaign => (
                <SelectItem key={campaign.campaign_id} value={campaign.campaign_id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredLeads.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <div className="text-muted-foreground">
              {leads.length === 0 ? 'No leads found for this ad account' : 'No leads match your filters'}
            </div>
            {leads.length === 0 && (
              <div className="text-sm text-muted-foreground max-w-md mx-auto">
                <p className="mb-2">This could be because:</p>
                <ul className="text-left space-y-1">
                  <li>• No lead ads have been created yet</li>
                  <li>• No leads have been generated from your campaigns</li>
                  <li>• Missing <code className="bg-muted px-1 rounded">leads_retrieval</code> permission</li>
                  <li>• App needs Facebook review for production lead access</li>
                </ul>
                <p className="mt-3 text-xs">
                  Check your Facebook Business Manager to ensure lead forms are properly configured.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ad Name</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      {lead.name || 'N/A'}
                    </TableCell>
                    <TableCell>{lead.email || 'N/A'}</TableCell>
                    <TableCell>{lead.phone || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {lead.campaign_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(lead.campaign_status)}>
                        {lead.campaign_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {lead.ad_name}
                    </TableCell>
                    <TableCell>
                      {format(new Date(lead.created_time), 'MMM dd, yyyy HH:mm')}
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
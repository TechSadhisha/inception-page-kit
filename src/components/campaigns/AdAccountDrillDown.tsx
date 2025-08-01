import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useFacebookIntegration } from '@/hooks/useFacebookIntegration'
import { Loader2, Building, Layers, Users, Unplug, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'

interface FacebookAdAccount {
  id: string
  name: string
}

interface FacebookCampaign {
  id: string
  name: string
}

interface AdAccountDrillDownProps {
  onLeadsDataReady: (data: any) => void
}

export const AdAccountDrillDown = ({ onLeadsDataReady }: AdAccountDrillDownProps) => {
  const { integration, isConnected, hasValidToken, disconnect, connecting } = useFacebookIntegration()
  const { toast } = useToast()
  
  const [adAccounts, setAdAccounts] = useState<FacebookAdAccount[]>([])
  const [campaigns, setCampaigns] = useState<FacebookCampaign[]>([])
  const [selectedAdAccountId, setSelectedAdAccountId] = useState<string>('')
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('')
  
  const [loadingAdAccounts, setLoadingAdAccounts] = useState(false)
  const [loadingCampaigns, setLoadingCampaigns] = useState(false)
  const [loadingLeads, setLoadingLeads] = useState(false)

  // Clear leads data when selections change
  const clearLeadsData = () => {
    onLeadsDataReady({
      campaigns: [],
      leads: [],
      total_leads: 0,
      summary: null
    })
  }

  // Step 1: Get Ad Accounts
  const fetchAdAccounts = async () => {
    if (!isConnected || !hasValidToken) return
    
    setLoadingAdAccounts(true)
    try {
      const { data, error } = await supabase.functions.invoke('fetch-campaigns-and-leads', {
        body: { action: 'get_ad_accounts' }
      })

      if (error) throw error

      setAdAccounts(data.ad_accounts || [])
    } catch (error) {
      console.error('Error fetching ad accounts:', error)
      toast({
        title: "Error",
        description: "Failed to fetch ad accounts.",
        variant: "destructive"
      })
    } finally {
      setLoadingAdAccounts(false)
    }
  }

  // Step 2: Get Campaigns for selected Ad Account
  const fetchCampaigns = async (adAccountId: string) => {
    setLoadingCampaigns(true)
    setCampaigns([])
    setSelectedCampaignId('')
    clearLeadsData()
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-campaigns-and-leads', {
        body: { 
          action: 'get_campaigns',
          ad_account_id: adAccountId
        }
      })

      if (error) throw error

      setCampaigns(data.campaigns || [])
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      toast({
        title: "Error",
        description: "Failed to fetch campaigns for this ad account.",
        variant: "destructive"
      })
    } finally {
      setLoadingCampaigns(false)
    }
  }

  // Step 4: Get Leads for selected Campaign
  const fetchLeads = async (campaignId: string) => {
    setLoadingLeads(true)
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-campaigns-and-leads', {
        body: { 
          action: 'get_leads',
          campaign_id: campaignId
        }
      })

      if (error) throw error

      onLeadsDataReady({
        campaigns: [{ id: campaignId, name: campaigns.find(c => c.id === campaignId)?.name || 'Selected Campaign' }],
        leads: data.leads || [],
        total_leads: data.total_leads || 0,
        summary: { total_campaigns: 1, total_leads: data.total_leads || 0 }
      })

      toast({
        title: "Success",
        description: `Found ${data.total_leads || 0} leads for this campaign.`
      })
    } catch (error) {
      console.error('Error fetching leads:', error)
      toast({
        title: "Error",
        description: "Failed to fetch leads. Please check your permissions.",
        variant: "destructive"
      })
    } finally {
      setLoadingLeads(false)
    }
  }

  const handleAdAccountChange = (adAccountId: string) => {
    setSelectedAdAccountId(adAccountId)
    fetchCampaigns(adAccountId)
  }

  const handleCampaignChange = (campaignId: string) => {
    setSelectedCampaignId(campaignId)
    // Automatically fetch leads when campaign is selected
    fetchLeads(campaignId)
  }

  useEffect(() => {
    if (isConnected && hasValidToken) {
      fetchAdAccounts()
    }
  }, [isConnected, hasValidToken])

  if (!isConnected) {
    return null
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Ad Account Drill Down
            </CardTitle>
            <CardDescription>
              Select Ad Account → Campaign → Get Leads
            </CardDescription>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={connecting}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Unplug className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Disconnect Facebook Account</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently disconnect your Facebook account and remove all associated data including:
                  <br /><br />
                  • All campaign data and analytics
                  <br />
                  • All lead information and contacts
                  <br />
                  • All cached Facebook data
                  <br />
                  • Your Facebook access tokens
                  <br /><br />
                  This action cannot be undone. You'll need to reconnect and reconfigure everything.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={disconnect}
                  disabled={connecting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {connecting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Yes, Disconnect
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ad Account Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Building className="h-4 w-4" />
            Ad Account
          </label>
          <Select
            value={selectedAdAccountId}
            onValueChange={handleAdAccountChange}
            disabled={loadingAdAccounts || !adAccounts.length}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingAdAccounts ? "Loading ad accounts..." : "Select an ad account"} />
            </SelectTrigger>
            <SelectContent>
              {adAccounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingAdAccounts && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading ad accounts...
            </div>
          )}
        </div>

        {/* Campaign Selection */}
        {selectedAdAccountId && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Campaign {campaigns.length > 0 && `(${campaigns.length} available)`}
            </label>
            <Select
              value={selectedCampaignId}
              onValueChange={handleCampaignChange}
              disabled={loadingCampaigns || !campaigns.length}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingCampaigns ? "Loading campaigns..." : "Select a campaign to get leads"} />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {loadingCampaigns && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading campaigns...
              </div>
            )}
            {loadingLeads && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Fetching leads...
              </div>
            )}
            {selectedAdAccountId && campaigns.length === 0 && !loadingCampaigns && (
              <Alert>
                <AlertDescription>
                  No campaigns found for this ad account.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}


        {/* Current Selection Summary */}
        {selectedAdAccountId && (
          <div className="text-sm text-muted-foreground border-t pt-4">
            <div className="space-y-1">
              <p><strong>Ad Account:</strong> {adAccounts.find(a => a.id === selectedAdAccountId)?.name}</p>
              {selectedCampaignId && (
                <p><strong>Campaign:</strong> {campaigns.find(c => c.id === selectedCampaignId)?.name}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
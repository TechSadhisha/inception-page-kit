import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useFacebookIntegration } from '@/hooks/useFacebookIntegration'
import { Loader2, Building, Layers, Target, Users, RefreshCw, Unplug, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'

interface FacebookAdAccount {
  id: string
  name: string
  account_status: number
}

interface FacebookCampaign {
  id: string
  name: string
  status: string
}

interface FacebookAd {
  id: string
  name: string
  adcreatives?: {
    data: Array<{
      object_story_spec?: {
        link_data?: {
          leadgen_form_id?: string
        }
      }
    }>
  }
}

interface AdAccountDrillDownProps {
  onLeadsDataReady: (data: any) => void
}

export const AdAccountDrillDown = ({ onLeadsDataReady }: AdAccountDrillDownProps) => {
  const { integration, isConnected, hasValidToken, disconnect, connecting } = useFacebookIntegration()
  const { toast } = useToast()
  
  const [adAccounts, setAdAccounts] = useState<FacebookAdAccount[]>([])
  const [campaigns, setCampaigns] = useState<FacebookCampaign[]>([])
  const [ads, setAds] = useState<FacebookAd[]>([])
  const [selectedAdAccountId, setSelectedAdAccountId] = useState<string>('')
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('')
  const [selectedAdId, setSelectedAdId] = useState<string>('')
  
  const [loadingAdAccounts, setLoadingAdAccounts] = useState(false)
  const [loadingCampaigns, setLoadingCampaigns] = useState(false)
  const [loadingAds, setLoadingAds] = useState(false)
  const [loadingLeads, setLoadingLeads] = useState(false)

  // Clear all downstream data when selections change
  const clearDownstreamData = (level: 'campaigns' | 'ads' | 'leads') => {
    if (level === 'campaigns') {
      setCampaigns([])
      setAds([])
      setSelectedCampaignId('')
      setSelectedAdId('')
    } else if (level === 'ads') {
      setAds([])
      setSelectedAdId('')
    }
    
    // Always clear leads data when any selection changes
    onLeadsDataReady({
      campaigns: [],
      leads: [],
      summary: null
    })
  }

  const fetchAdAccounts = async () => {
    if (!isConnected || !hasValidToken || !integration?.access_token) return
    
    setLoadingAdAccounts(true)
    try {
      const response = await fetch(
        `https://graph.facebook.com/v20.0/me/adaccounts?fields=id,name,account_status&access_token=${integration.access_token}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch ad accounts')
      }
      
      const data = await response.json()
      setAdAccounts(data.data || [])
    } catch (error) {
      console.error('Error fetching ad accounts:', error)
      toast({
        title: "Error",
        description: "Failed to fetch ad accounts. Please check your Facebook permissions.",
        variant: "destructive"
      })
    } finally {
      setLoadingAdAccounts(false)
    }
  }

  const fetchCampaigns = async (adAccountId: string) => {
    if (!integration?.access_token) return
    
    setLoadingCampaigns(true)
    clearDownstreamData('campaigns')
    
    try {
      const response = await fetch(
        `https://graph.facebook.com/v20.0/${adAccountId}/campaigns?fields=id,name,status&access_token=${integration.access_token}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns')
      }
      
      const data = await response.json()
      setCampaigns(data.data || [])
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

  const fetchAds = async (campaignId: string) => {
    if (!integration?.access_token) return
    
    setLoadingAds(true)
    clearDownstreamData('ads')
    
    try {
      const response = await fetch(
        `https://graph.facebook.com/v20.0/${campaignId}/ads?fields=id,name,adcreatives{object_story_spec}&access_token=${integration.access_token}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch ads')
      }
      
      const data = await response.json()
      setAds(data.data || [])
    } catch (error) {
      console.error('Error fetching ads:', error)
      toast({
        title: "Error",
        description: "Failed to fetch ads for this campaign.",
        variant: "destructive"
      })
    } finally {
      setLoadingAds(false)
    }
  }

  const fetchLeadsForAllAds = async () => {
    if (!integration?.access_token || !selectedAdAccountId) return
    
    setLoadingLeads(true)
    
    try {
      // Use the existing edge function but with the new ad account flow
      const { data, error } = await supabase.functions.invoke('fetch-campaigns-and-leads', {
        body: {
          ad_account_id: selectedAdAccountId,
          campaign_id: selectedCampaignId || undefined
        }
      })

      if (error) throw error

      onLeadsDataReady({
        campaigns: data.campaigns || [],
        leads: data.leads || [],
        summary: data.summary || null
      })

      toast({
        title: "Success",
        description: `Found ${data.leads?.length || 0} leads from ${data.campaigns?.length || 0} campaigns.`
      })
    } catch (error) {
      console.error('Error fetching leads:', error)
      toast({
        title: "Error",
        description: "Failed to fetch leads. Please check your permissions for leads_retrieval.",
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
    fetchAds(campaignId)
    // Automatically fetch leads when campaign is selected
    setTimeout(() => {
      fetchLeadsForAllAds()
    }, 500) // Small delay to let ads load first
  }

  const handleAdChange = (adId: string) => {
    setSelectedAdId(adId)
  }

  useEffect(() => {
    if (isConnected && hasValidToken) {
      fetchAdAccounts()
    }
  }, [isConnected, hasValidToken])

  if (!isConnected) {
    return null
  }

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

  const getAccountStatusVariant = (status: number) => {
    return status === 1 ? 'default' : 'destructive'
  }

  const hasLeadForms = ads.some(ad => 
    ad.adcreatives?.data?.some(creative => 
      creative.object_story_spec?.link_data?.leadgen_form_id
    )
  )

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
              Select Ad Account → Campaign → View Leads (Page selection removed)
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
                  <Badge 
                    variant={getAccountStatusVariant(account.account_status)} 
                    className="ml-2 text-xs"
                  >
                    {account.account_status === 1 ? "Active" : "Inactive"}
                  </Badge>
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
                <SelectValue placeholder={loadingCampaigns ? "Loading campaigns..." : "Select a campaign"} />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                    <Badge 
                      variant={getStatusVariant(campaign.status)} 
                      className="ml-2 text-xs"
                    >
                      {campaign.status}
                    </Badge>
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
            {selectedAdAccountId && campaigns.length === 0 && !loadingCampaigns && (
              <Alert>
                <AlertDescription>
                  No campaigns found for this ad account.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Ads Preview */}
        {selectedCampaignId && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Ads {ads.length > 0 && `(${ads.length} found, ${ads.filter(ad => ad.adcreatives?.data?.some(c => c.object_story_spec?.link_data?.leadgen_form_id)).length} with lead forms)`}
            </label>
            {loadingAds && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading ads...
              </div>
            )}
            {ads.length > 0 && !loadingAds && (
              <div className="grid gap-2 max-h-32 overflow-y-auto">
                {ads.slice(0, 5).map((ad) => {
                  const hasLeadForm = ad.adcreatives?.data?.some(creative => 
                    creative.object_story_spec?.link_data?.leadgen_form_id
                  )
                  return (
                    <div key={ad.id} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm truncate">{ad.name}</span>
                      {hasLeadForm && (
                        <Badge variant="secondary" className="text-xs">
                          Lead Form
                        </Badge>
                      )}
                    </div>
                  )
                })}
                {ads.length > 5 && (
                  <div className="text-sm text-muted-foreground p-2">
                    +{ads.length - 5} more ads...
                  </div>
                )}
              </div>
            )}
            {selectedCampaignId && ads.length === 0 && !loadingAds && (
              <Alert>
                <AlertDescription>
                  No ads found for this campaign.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Fetch Leads Button */}
        {selectedAdAccountId && (
          <div className="flex flex-col gap-2">
            <Button
              onClick={fetchLeadsForAllAds}
              disabled={loadingLeads || !hasLeadForms}
              className="w-full"
            >
              {loadingLeads ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Fetching Leads...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Fetch All Leads{selectedCampaignId ? ' for Campaign' : ' for Account'}
                </>
              )}
            </Button>
            
            {!hasLeadForms && ads.length > 0 && (
              <Alert>
                <AlertDescription>
                  No lead forms found in the selected ads. Leads can only be fetched from ads with lead generation forms.
                </AlertDescription>
              </Alert>
            )}
            
            {selectedAdAccountId && !selectedCampaignId && (
              <p className="text-xs text-muted-foreground text-center">
                Tip: Select a specific campaign to focus on its leads, or fetch all leads from the entire ad account.
              </p>
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
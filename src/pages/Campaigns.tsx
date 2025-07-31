import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CampaignHeader } from '@/components/campaigns/CampaignHeader'
import { CampaignList } from '@/components/campaigns/CampaignList'
import { CampaignAnalytics } from '@/components/campaigns/CampaignAnalytics'
import { CampaignSettings } from '@/components/campaigns/CampaignSettings'
import { CampaignSummary } from '@/components/campaigns/CampaignSummary'
import { LeadsTable } from '@/components/campaigns/LeadsTable'
import { PageAndAccountSelector } from '@/components/campaigns/PageAndAccountSelector'
import { CampaignStatusTabs } from '@/components/campaigns/CampaignStatusTabs'
import { useCampaigns } from '@/hooks/useCampaigns'
import { useCampaignForm } from '@/hooks/useCampaignForm'
import { useFacebookIntegration } from '@/hooks/useFacebookIntegration'
import { useMetaCampaigns } from '@/hooks/useMetaCampaigns'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Facebook } from 'lucide-react'
import { FacebookOAuthButton } from '@/components/campaigns/FacebookOAuthButton'

const Campaigns = () => {
  const { campaigns, createCampaign, toggleCampaignStatus } = useCampaigns()
  const { newCampaign, setNewCampaign, resetForm } = useCampaignForm()
  const { integration, isConnected, loading: integrationLoading, refreshIntegration } = useFacebookIntegration()
  const { 
    campaigns: metaCampaigns, 
    leads: metaLeads, 
    summary, 
    loading: metaLoading, 
    fetchCampaignsAndLeads,
    refreshData: refreshMetaData 
  } = useMetaCampaigns()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Listen for Facebook auth success and clear data events
  useEffect(() => {
    const handleAuthSuccess = () => {
      // Clear all old data and reload integration
      refreshIntegration()
    }
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'FACEBOOK_AUTH_SUCCESS') {
        handleAuthSuccess()
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    // Check URL params for auth success
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('auth') === 'success') {
      handleAuthSuccess()
      // Clean URL
      window.history.replaceState({}, '', '/campaigns')
    }
    
    return () => window.removeEventListener('message', handleMessage)
  }, [refreshIntegration])

  // Only fetch data when user explicitly selects page/account - no auto-fetching

  const handleCreateCampaign = () => {
    const success = createCampaign(newCampaign)
    if (success) {
      resetForm()
      setIsCreateDialogOpen(false)
    }
  }

  const handleSelectionComplete = (pageId: string, adAccountId: string) => {
    fetchCampaignsAndLeads(pageId, adAccountId)
  }

  const handleRefreshRequested = () => {
    if (integration?.selected_page_id && integration?.ad_account_id) {
      fetchCampaignsAndLeads(integration.selected_page_id, integration.ad_account_id)
    }
  }

  if (integrationLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Ad Campaigns</h1>
          <p className="text-muted-foreground">Loading campaign integration status...</p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Ad Campaigns</h1>
          <p className="text-muted-foreground">Manage your Meta and Instagram advertising campaigns</p>
        </div>

        <Alert className="max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="space-y-4">
            <div>
              <p className="font-medium">Facebook Integration Required</p>
              <p className="text-sm text-muted-foreground">
                To create and manage ad campaigns, you need to connect your Facebook Business account first.
                This will allow you to access your ad accounts and manage campaigns directly from the CRM.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FacebookOAuthButton 
                onSuccess={() => {
                  // Integration will be automatically detected and page will refresh
                  refreshIntegration()
                }}
                onError={(error) => console.error('OAuth error:', error)}
              />
              <span className="text-sm text-muted-foreground">or</span>
              <a 
                href="#settings" 
                className="text-sm text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  // You could scroll to settings tab or navigate there
                }}
              >
                Configure in Settings
              </a>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CampaignHeader
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        newCampaign={newCampaign}
        setNewCampaign={setNewCampaign}
        onCreateCampaign={handleCreateCampaign}
      />

      <PageAndAccountSelector
        onSelectionComplete={handleSelectionComplete}
        onRefreshRequested={handleRefreshRequested}
        loading={metaLoading}
      />

      {integration?.selected_page_id && integration?.ad_account_id && (
        <CampaignSummary 
          campaigns={metaCampaigns}
          leads={metaLeads}
          summary={summary}
          loading={metaLoading}
          onRefresh={() => refreshMetaData(integration?.selected_page_id || undefined, integration?.ad_account_id || undefined)}
        />
      )}

      {integration?.selected_page_id && integration?.ad_account_id ? (
        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-4">
            <LeadsTable 
              leads={metaLeads}
              campaigns={metaCampaigns}
              loading={metaLoading}
            />
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <CampaignStatusTabs
              campaigns={metaCampaigns}
              loading={metaLoading}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <CampaignAnalytics campaigns={campaigns} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <CampaignSettings />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Please select a Facebook Page and Ad Account above to view campaigns and leads.
        </div>
      )}
    </div>
  )
}

export default Campaigns
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CampaignHeader } from '@/components/campaigns/CampaignHeader'
import { CampaignList } from '@/components/campaigns/CampaignList'
import { CampaignAnalytics } from '@/components/campaigns/CampaignAnalytics'
import { CampaignSettings } from '@/components/campaigns/CampaignSettings'
import { useCampaigns } from '@/hooks/useCampaigns'
import { useCampaignForm } from '@/hooks/useCampaignForm'
import { useFacebookIntegration } from '@/hooks/useFacebookIntegration'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Facebook } from 'lucide-react'
import { FacebookOAuthButton } from '@/components/campaigns/FacebookOAuthButton'

const Campaigns = () => {
  const { campaigns, createCampaign, toggleCampaignStatus } = useCampaigns()
  const { newCampaign, setNewCampaign, resetForm } = useCampaignForm()
  const { isConnected, loading: integrationLoading } = useFacebookIntegration()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreateCampaign = () => {
    const success = createCampaign(newCampaign)
    if (success) {
      resetForm()
      setIsCreateDialogOpen(false)
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
                  // Integration will be automatically detected and page will re-render
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

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">All Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <CampaignList
            campaigns={campaigns}
            onToggleStatus={toggleCampaignStatus}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <CampaignAnalytics campaigns={campaigns} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <CampaignSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Campaigns
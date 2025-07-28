
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CampaignHeader } from '@/components/campaigns/CampaignHeader'
import { CampaignList } from '@/components/campaigns/CampaignList'
import { CampaignAnalytics } from '@/components/campaigns/CampaignAnalytics'
import { CampaignSettings } from '@/components/campaigns/CampaignSettings'
import { useCampaigns } from '@/hooks/useCampaigns'
import { useCampaignForm } from '@/hooks/useCampaignForm'

const Campaigns = () => {
  const { campaigns, createCampaign, toggleCampaignStatus } = useCampaigns()
  const { newCampaign, setNewCampaign, resetForm } = useCampaignForm()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreateCampaign = () => {
    const success = createCampaign(newCampaign)
    if (success) {
      resetForm()
      setIsCreateDialogOpen(false)
    }
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

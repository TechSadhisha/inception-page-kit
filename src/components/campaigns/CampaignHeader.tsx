
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { CampaignForm } from './CampaignForm'

interface CampaignHeaderProps {
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  newCampaign: any
  setNewCampaign: (campaign: any) => void
  onCreateCampaign: () => void
}

export const CampaignHeader = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  newCampaign,
  setNewCampaign,
  onCreateCampaign
}: CampaignHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Ad Campaigns</h1>
        <p className="text-muted-foreground">Manage your Meta and Instagram advertising campaigns</p>
      </div>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Set up a new advertising campaign for Meta and Instagram platforms
            </DialogDescription>
          </DialogHeader>
          <CampaignForm
            newCampaign={newCampaign}
            setNewCampaign={setNewCampaign}
            onSubmit={onCreateCampaign}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

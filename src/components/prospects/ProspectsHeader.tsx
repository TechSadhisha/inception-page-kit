
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Upload, Download } from 'lucide-react'
import { BulkProspectImport } from './BulkProspectImport'
import { LeadIntegration } from '@/components/leads/LeadIntegration'

interface ProspectsHeaderProps {
  canCreateProspect: boolean
  effectiveProjectId: string
  bulkImportOpen: boolean
  setBulkImportOpen: (open: boolean) => void
  leadIntegrationOpen: boolean
  setLeadIntegrationOpen: (open: boolean) => void
  handleNewProspectClick: () => void
  handleBulkImport: (prospects: any[]) => void
  isCreating: boolean
}

export const ProspectsHeader = ({
  canCreateProspect,
  effectiveProjectId,
  bulkImportOpen,
  setBulkImportOpen,
  leadIntegrationOpen,
  setLeadIntegrationOpen,
  handleNewProspectClick,
  handleBulkImport,
  isCreating,
}: ProspectsHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prospects</h1>
          <p className="text-muted-foreground">
            Manage your project prospects and track their interest levels
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setLeadIntegrationOpen(true)}
          >
            <Download className="mr-2 h-4 w-4" />
            Lead Integration
          </Button>
          
          <Dialog open={bulkImportOpen} onOpenChange={setBulkImportOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                disabled={!canCreateProspect}
              >
                <Upload className="mr-2 h-4 w-4" />
                Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              {canCreateProspect && (
                <BulkProspectImport
                  projectId={effectiveProjectId}
                  onImport={handleBulkImport}
                  isLoading={isCreating}
                />
              )}
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={handleNewProspectClick}
            disabled={!canCreateProspect}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Prospect
          </Button>
        </div>
      </div>

      <Dialog open={leadIntegrationOpen} onOpenChange={setLeadIntegrationOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <LeadIntegration />
        </DialogContent>
      </Dialog>
    </>
  )
}

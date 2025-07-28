
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Upload } from 'lucide-react'
import { Project } from '@/types/database'

interface ProspectsEmptyStateProps {
  selectedProjectId: string
  projects: Project[]
  filteredProspectsLength: number
  totalProspectsLength: number
  canCreateProspect: boolean
  handleNewProspectClick: () => void
  setBulkImportOpen: (open: boolean) => void
}

export const ProspectsEmptyState = ({
  selectedProjectId,
  projects,
  filteredProspectsLength,
  totalProspectsLength,
  canCreateProspect,
  handleNewProspectClick,
  setBulkImportOpen,
}: ProspectsEmptyStateProps) => {
  if (selectedProjectId === 'all' && projects.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select a Project</CardTitle>
          <CardDescription>
            Choose a project to view and manage its prospects, or create a new prospect which will be added to the first available project.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (filteredProspectsLength === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Prospects Found</CardTitle>
          <CardDescription>
            {totalProspectsLength === 0 
              ? canCreateProspect 
                ? "Get started by adding your first prospect or importing from Excel."
                : "Create a project first, then add prospects to track their interest."
              : "No prospects match your search criteria."
            }
          </CardDescription>
        </CardHeader>
        {canCreateProspect && totalProspectsLength === 0 && (
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={handleNewProspectClick}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Prospect
              </Button>
              <Button variant="outline" onClick={() => setBulkImportOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Import from Excel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    )
  }

  return null
}

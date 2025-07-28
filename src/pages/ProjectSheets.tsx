
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GoogleSheetsViewer } from '@/components/sheets/GoogleSheetsViewer'
import { useProjects } from '@/hooks/useProjects'

const ProjectSheets = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { projects } = useProjects()
  
  const project = projects.find(p => p.id === projectId)

  if (!projectId) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Not Found</CardTitle>
            <CardDescription>
              The requested project could not be found.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/projects')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {project?.name || 'Project'} - Sheets
            </h1>
            <p className="text-muted-foreground">
              Manage and access Google Sheets for this project
            </p>
          </div>
        </div>
      </div>

      <GoogleSheetsViewer projectId={projectId} />
    </div>
  )
}

export default ProjectSheets

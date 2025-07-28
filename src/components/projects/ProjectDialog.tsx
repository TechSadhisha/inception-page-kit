
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ProjectForm } from './ProjectForm'
import { Project } from '@/types/database'

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project | null
  onSubmit: (data: {
    name: string
    description: string
    status: 'planning' | 'active' | 'completed' | 'on_hold'
  }) => void
  isLoading?: boolean
}

export const ProjectDialog = ({ 
  open, 
  onOpenChange, 
  project, 
  onSubmit, 
  isLoading 
}: ProjectDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
          <DialogDescription>
            {project 
              ? 'Update the project details below.' 
              : 'Fill in the details to create a new project.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <ProjectForm
          project={project}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}

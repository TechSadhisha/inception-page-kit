import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, Square, MoreVertical } from 'lucide-react'
import { WorkflowInstance } from '@/types/workflow'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

interface WorkflowInstanceCardProps {
  instance: WorkflowInstance
  onExecuteAction: (action: string) => void
  isExecuting: boolean
}

const statusColors = {
  running: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  paused: 'bg-yellow-100 text-yellow-800',
}

export const WorkflowInstanceCard = ({ instance, onExecuteAction, isExecuting }: WorkflowInstanceCardProps) => {
  const getProgress = () => {
    // Mock progress calculation - in real app, this would be based on actual steps
    const totalSteps = 5 // This would come from the template
    return (instance.current_step / totalSteps) * 100
  }

  const getDuration = () => {
    const start = new Date(instance.started_at)
    const end = instance.completed_at ? new Date(instance.completed_at) : new Date()
    const diffMs = end.getTime() - start.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`
    }
    return `${diffMinutes}m`
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg">
            {(instance as any).workflow_templates?.name || 'Workflow Instance'}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={statusColors[instance.status]}>
              {instance.status}
            </Badge>
            <Badge variant="outline">
              {instance.entity_type}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Step {instance.current_step}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {instance.status === 'running' && (
              <>
                <DropdownMenuItem onClick={() => onExecuteAction('pause')}>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExecuteAction('stop')}>
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </DropdownMenuItem>
              </>
            )}
            {instance.status === 'paused' && (
              <DropdownMenuItem onClick={() => onExecuteAction('resume')}>
                <Play className="mr-2 h-4 w-4" />
                Resume
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onExecuteAction('restart')}>
              <Play className="mr-2 h-4 w-4" />
              Restart
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(getProgress())}%</span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Duration:</span>
            <div className="font-medium">{getDuration()}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Entity ID:</span>
            <div className="font-medium text-xs">{instance.entity_id.slice(0, 8)}...</div>
          </div>
        </div>

        {instance.context_data && Object.keys(instance.context_data).length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Context Data:</span>
            <div className="bg-muted p-2 rounded text-xs">
              {Object.entries(instance.context_data).slice(0, 3).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground">{key}:</span>
                  <span>{String(value).slice(0, 20)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Started: {new Date(instance.started_at).toLocaleString()}
          {instance.completed_at && (
            <span className="ml-2">• Completed: {new Date(instance.completed_at).toLocaleString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
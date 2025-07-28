import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Settings, Users, Target, Zap, DollarSign } from 'lucide-react'
import { WorkflowTemplate } from '@/types/workflow'

interface WorkflowTemplateCardProps {
  template: WorkflowTemplate
  onStart: (entityType: 'prospect' | 'property' | 'project' | 'task', entityId: string) => void
  isStarting: boolean
}

const categoryIcons = {
  lead_management: Users,
  sales_pipeline: Target,
  post_sales: Settings,
  commission: DollarSign,
  marketing: Zap,
}

const categoryColors = {
  lead_management: 'bg-blue-100 text-blue-800',
  sales_pipeline: 'bg-green-100 text-green-800',
  post_sales: 'bg-purple-100 text-purple-800',
  commission: 'bg-orange-100 text-orange-800',
  marketing: 'bg-pink-100 text-pink-800',
}

export const WorkflowTemplateCard = ({ template, onStart, isStarting }: WorkflowTemplateCardProps) => {
  const IconComponent = categoryIcons[template.category]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {template.name}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={categoryColors[template.category]}>
              {template.category.replace('_', ' ')}
            </Badge>
            <Badge variant="outline">
              {template.trigger_type}
            </Badge>
            {template.is_system && (
              <Badge variant="secondary">System</Badge>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {template.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {template.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Trigger: </span>
            <span className="text-muted-foreground">
              {template.trigger_type === 'event' ? 'Automatic on events' :
               template.trigger_type === 'schedule' ? 'Scheduled execution' :
               template.trigger_type === 'condition' ? 'Condition-based' :
               'Manual start'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Status: {template.is_active ? 'Active' : 'Inactive'}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // For demo, we'll start with a mock entity
                  onStart('prospect', 'demo-prospect-id')
                }}
                disabled={!template.is_active || isStarting}
              >
                <Play className="mr-2 h-3 w-3" />
                {isStarting ? 'Starting...' : 'Start'}
              </Button>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Created: {new Date(template.created_at).toLocaleDateString()}
          {template.updated_at !== template.created_at && (
            <span className="ml-2">• Updated: {new Date(template.updated_at).toLocaleDateString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
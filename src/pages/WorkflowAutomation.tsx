import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Play, Pause, Settings, Zap, Target, Users, TrendingUp } from 'lucide-react'
import { useWorkflows } from '@/hooks/useWorkflows'
import { WorkflowTemplateCard } from '@/components/workflows/WorkflowTemplateCard'
import { WorkflowInstanceCard } from '@/components/workflows/WorkflowInstanceCard'
import { AutomationRuleCard } from '@/components/workflows/AutomationRuleCard'
import { LeadScoringConfig } from '@/components/workflows/LeadScoringConfig'
import { CommissionTracker } from '@/components/workflows/CommissionTracker'

const WorkflowAutomation = () => {
  const { 
    templates, 
    instances, 
    automationRules, 
    isLoading,
    startWorkflow,
    createRule,
    executeAction,
    isStarting,
    isCreatingRule,
    isExecuting
  } = useWorkflows()

  const [activeTab, setActiveTab] = useState('templates')

  const activeInstances = instances.filter(i => i.status === 'running')
  const completedInstances = instances.filter(i => i.status === 'completed')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workflow Automation</h1>
          <p className="text-muted-foreground">
            Automate your real estate sales processes and lead management
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInstances.length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">Available templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automation Rules</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationRules.filter(r => r.is_active).length}</div>
            <p className="text-xs text-muted-foreground">Active rules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedInstances.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="instances" className="flex items-center space-x-2">
            <Play className="h-4 w-4" />
            <span>Active</span>
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Rules</span>
          </TabsTrigger>
          <TabsTrigger value="scoring" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Lead Scoring</span>
          </TabsTrigger>
          <TabsTrigger value="commission" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Commission</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Workflow Templates</h2>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <WorkflowTemplateCard
                key={template.id}
                template={template}
                onStart={(entityType, entityId) => startWorkflow(template.id, entityType, entityId)}
                isStarting={isStarting}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="instances" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Workflow Instances</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{activeInstances.length} Running</Badge>
              <Badge variant="secondary">{instances.filter(i => i.status === 'paused').length} Paused</Badge>
            </div>
          </div>
          
          <div className="grid gap-4">
            {activeInstances.map((instance) => (
              <WorkflowInstanceCard
                key={instance.id}
                instance={instance}
                onExecuteAction={(action) => executeAction(instance.id, action)}
                isExecuting={isExecuting}
              />
            ))}
          </div>

          {activeInstances.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No Active Workflows</CardTitle>
                <CardDescription>
                  Start a workflow from the templates tab or create automation rules to trigger workflows automatically.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Automation Rules</h2>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create Rule
            </Button>
          </div>
          
          <div className="grid gap-4">
            {automationRules.map((rule) => (
              <AutomationRuleCard
                key={rule.id}
                rule={rule}
                onToggle={(isActive) => {
                  // Handle rule toggle
                  console.log('Toggle rule:', rule.id, isActive)
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scoring" className="space-y-4">
          <LeadScoringConfig />
        </TabsContent>

        <TabsContent value="commission" className="space-y-4">
          <CommissionTracker />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Analytics</CardTitle>
              <CardDescription>
                Performance metrics and insights for your automated workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((completedInstances.length / (instances.length || 1)) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(instances.reduce((sum, i) => {
                      if (i.completed_at && i.started_at) {
                        return sum + (new Date(i.completed_at).getTime() - new Date(i.started_at).getTime()) / (1000 * 60 * 60)
                      }
                      return sum
                    }, 0) / (completedInstances.length || 1))}h
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. Duration</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {instances.filter(i => new Date(i.started_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                  </div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default WorkflowAutomation
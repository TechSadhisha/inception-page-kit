import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { AlertCircle, CheckCircle, Clock, Settings, Download, Facebook } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useProjects } from '@/hooks/useProjects'
import { useLeadIntegration } from '@/hooks/useLeadIntegration'
import { FacebookLeadFormsTab } from './FacebookLeadFormsTab'

export const LeadIntegration = () => {
  const { toast } = useToast()
  const { projects } = useProjects()
  const { 
    leadSources, 
    facebookLeadForms,
    syncing, 
    syncLeads, 
    syncFacebookLeads,
    toggleSource, 
    toggleFacebookForm,
    updateCredentials,
    addFacebookForm,
    removeFacebookForm
  } = useLeadIntegration()
  const [selectedProject, setSelectedProject] = useState<string>('')

  const [credentials, setCredentials] = useState({
    magicbricks: { apiKey: '', projectId: '' },
    '99acres': { username: '', password: '' },
    housing: { apiToken: '', builderId: '' },
    callyzer: { apiKey: '', webhookUrl: '' }
  })

  const handleSync = async (sourceId: string) => {
    if (!selectedProject) {
      toast({
        title: "Project Required",
        description: "Please select a project to sync leads to",
        variant: "destructive",
      })
      return
    }

    await syncLeads(sourceId, selectedProject)
  }

  const getStatusIcon = (status: 'connected' | 'disconnected' | 'syncing' | 'error') => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'syncing':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: 'connected' | 'disconnected' | 'syncing' | 'error') => {
    const variants = {
      connected: 'default',
      disconnected: 'secondary',
      syncing: 'outline',
      error: 'destructive'
    } as const

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Integration</h2>
          <p className="text-muted-foreground">
            Connect and sync leads from real estate platforms, call tracking systems, and Facebook lead forms
          </p>
        </div>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select target project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            Facebook Lead Forms
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leadSources.map((source) => (
              <Card key={source.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                    {getStatusIcon(source.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(source.status)}
                    <Switch 
                      checked={source.enabled} 
                      onCheckedChange={(enabled) => toggleSource(source.id, enabled)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Leads:</span>
                    <span className="font-medium">{source.totalLeads}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">New Leads:</span>
                    <Badge variant="outline" className="text-xs">
                      {source.newLeads}
                    </Badge>
                  </div>
                  {source.lastSync && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span className="text-xs">
                        {new Date(source.lastSync).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSync(source.id)}
                      disabled={!source.enabled || syncing === source.id || !selectedProject}
                      className="flex-1"
                    >
                      {syncing === source.id ? (
                        <>
                          <Clock className="mr-2 h-3 w-3 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-3 w-3" />
                          Sync Now
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="facebook" className="space-y-4">
          <FacebookLeadFormsTab
            facebookLeadForms={facebookLeadForms}
            syncing={syncing}
            selectedProject={selectedProject}
            onSync={syncFacebookLeads}
            onToggle={toggleFacebookForm}
            onAdd={addFacebookForm}
            onRemove={removeFacebookForm}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>MagicBricks Configuration</CardTitle>
                <CardDescription>
                  Connect your MagicBricks account to import leads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mb-api-key">API Key</Label>
                  <Input
                    id="mb-api-key"
                    placeholder="Enter your MagicBricks API key"
                    value={credentials.magicbricks.apiKey}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      magicbricks: { ...prev.magicbricks, apiKey: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mb-project-id">Project ID</Label>
                  <Input
                    id="mb-project-id"
                    placeholder="Enter your project ID"
                    value={credentials.magicbricks.projectId}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      magicbricks: { ...prev.magicbricks, projectId: e.target.value }
                    }))}
                  />
                </div>
                <Button onClick={() => updateCredentials('magicbricks', credentials.magicbricks)}>
                  Save MagicBricks Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>99acres Configuration</CardTitle>
                <CardDescription>
                  Connect your 99acres account to import leads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="99-username">Username</Label>
                  <Input
                    id="99-username"
                    placeholder="Enter your 99acres username"
                    value={credentials['99acres'].username}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      '99acres': { ...prev['99acres'], username: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="99-password">Password</Label>
                  <Input
                    id="99-password"
                    type="password"
                    placeholder="Enter your password"
                    value={credentials['99acres'].password}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      '99acres': { ...prev['99acres'], password: e.target.value }
                    }))}
                  />
                </div>
                <Button onClick={() => updateCredentials('99acres', credentials['99acres'])}>
                  Save 99acres Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Housing.com Configuration</CardTitle>
                <CardDescription>
                  Connect your Housing.com account to import leads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="housing-token">API Token</Label>
                  <Input
                    id="housing-token"
                    placeholder="Enter your Housing.com API token"
                    value={credentials.housing.apiToken}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      housing: { ...prev.housing, apiToken: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="housing-builder-id">Builder ID</Label>
                  <Input
                    id="housing-builder-id"
                    placeholder="Enter your builder ID"
                    value={credentials.housing.builderId}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      housing: { ...prev.housing, builderId: e.target.value }
                    }))}
                  />
                </div>
                <Button onClick={() => updateCredentials('housing', credentials.housing)}>
                  Save Housing.com Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Callyzer Configuration</CardTitle>
                <CardDescription>
                  Connect your Callyzer account to import call leads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="callyzer-api-key">API Key</Label>
                  <Input
                    id="callyzer-api-key"
                    placeholder="Enter your Callyzer API key"
                    value={credentials.callyzer.apiKey}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      callyzer: { ...prev.callyzer, apiKey: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="callyzer-webhook">Webhook URL</Label>
                  <Input
                    id="callyzer-webhook"
                    placeholder="Enter your webhook URL"
                    value={credentials.callyzer.webhookUrl}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      callyzer: { ...prev.callyzer, webhookUrl: e.target.value }
                    }))}
                  />
                </div>
                <Button onClick={() => updateCredentials('callyzer', credentials.callyzer)}>
                  Save Callyzer Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

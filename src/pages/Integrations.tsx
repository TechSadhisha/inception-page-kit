import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Zap, Globe, MessageSquare, Phone, BarChart3, Settings, CheckCircle, AlertCircle } from 'lucide-react'
import { useIntegrations } from '@/hooks/useIntegrations'
import { IntegrationCard } from '@/components/integrations/IntegrationCard'
import { PortalIntegrationCard } from '@/components/integrations/PortalIntegrationCard'
import { LeadSourceCard } from '@/components/integrations/LeadSourceCard'
import { IntegrationDialog } from '@/components/integrations/IntegrationDialog'

const Integrations = () => {
  const { 
    integrations, 
    portalIntegrations, 
    leadSources, 
    isLoading,
    createIntegration,
    testConnection,
    syncData,
    toggleIntegration,
    isCreating,
    isTesting,
    isSyncing,
    isToggling
  } = useIntegrations()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const activeIntegrations = integrations.filter(i => i.is_active)
  const portalIntegrations_active = integrations.filter(i => i.integration_type === 'portal' && i.is_active)
  const marketingIntegrations = integrations.filter(i => i.integration_type === 'marketing')
  const communicationIntegrations = integrations.filter(i => i.integration_type === 'communication')

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
          <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground">
            Connect with real estate portals, marketing platforms, and communication tools
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIntegrations.length}</div>
            <p className="text-xs text-muted-foreground">Connected & syncing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portal Connections</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portalIntegrations_active.length}</div>
            <p className="text-xs text-muted-foreground">Real estate portals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Sources</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadSources.filter(s => s.is_active).length}</div>
            <p className="text-xs text-muted-foreground">Generating leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leadSources.reduce((sum, source) => sum + source.total_leads, 0)}
            </div>
            <p className="text-xs text-muted-foreground">From all sources</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="portals" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Portals</span>
          </TabsTrigger>
          <TabsTrigger value="marketing" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Marketing</span>
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Communication</span>
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Lead Sources</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onTest={() => testConnection(integration.id)}
                onSync={(dataType) => syncData(integration.id, dataType)}
                onToggle={(isActive) => toggleIntegration(integration.id, isActive)}
                isTesting={isTesting}
                isSyncing={isSyncing}
                isToggling={isToggling}
              />
            ))}
          </div>

          {integrations.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No Integrations Configured</CardTitle>
                <CardDescription>
                  Connect with real estate portals and marketing platforms to automate your lead generation and property management.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Integration
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="portals" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Real Estate Portal Integrations</h2>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Connect Portal
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portalIntegrations.map((portal) => (
              <PortalIntegrationCard
                key={portal.id}
                portal={portal}
                onSync={(dataType) => syncData(portal.integration_id, dataType)}
                isSyncing={isSyncing}
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Available Portal Integrations</CardTitle>
              <CardDescription>
                Connect with major Indian real estate portals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { name: 'MagicBricks', status: 'available', description: 'India\'s largest property portal' },
                  { name: '99acres', status: 'available', description: 'Leading property search portal' },
                  { name: 'Housing.com', status: 'available', description: 'Comprehensive property platform' },
                  { name: 'PropTiger', status: 'coming_soon', description: 'Real estate advisory platform' },
                  { name: 'Makaan.com', status: 'coming_soon', description: 'Property listing platform' },
                  { name: 'CommonFloor', status: 'coming_soon', description: 'Community-driven platform' }
                ].map((portal) => (
                  <div key={portal.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{portal.name}</h3>
                      <Badge variant={portal.status === 'available' ? 'default' : 'secondary'}>
                        {portal.status === 'available' ? 'Available' : 'Coming Soon'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{portal.description}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      disabled={portal.status !== 'available'}
                      onClick={() => setDialogOpen(true)}
                    >
                      {portal.status === 'available' ? 'Connect' : 'Notify Me'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Marketing Platform Integrations</h2>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Connect Platform
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {marketingIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onTest={() => testConnection(integration.id)}
                onSync={(dataType) => syncData(integration.id, dataType)}
                onToggle={(isActive) => toggleIntegration(integration.id, isActive)}
                isTesting={isTesting}
                isSyncing={isSyncing}
                isToggling={isToggling}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Communication Channel Integrations</h2>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Connect Channel
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {communicationIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onTest={() => testConnection(integration.id)}
                onSync={(dataType) => syncData(integration.id, dataType)}
                onToggle={(isActive) => toggleIntegration(integration.id, isActive)}
                isTesting={isTesting}
                isSyncing={isSyncing}
                isToggling={isToggling}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Lead Source Performance</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Total: {leadSources.reduce((sum, s) => sum + s.total_leads, 0)} leads
              </Badge>
              <Badge variant="outline">
                Qualified: {leadSources.reduce((sum, s) => sum + s.qualified_leads, 0)} leads
              </Badge>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leadSources.map((source) => (
              <LeadSourceCard
                key={source.id}
                source={source}
                onToggle={(isActive) => {
                  // Handle source toggle
                  console.log('Toggle source:', source.id, isActive)
                }}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <IntegrationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => {
          createIntegration(data)
          setDialogOpen(false)
        }}
        isLoading={isCreating}
      />
    </div>
  )
}

export default Integrations
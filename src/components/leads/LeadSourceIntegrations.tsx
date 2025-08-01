import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Globe, Settings, RefreshCw, Plus, Facebook, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface LeadSourceIntegrationsProps {
  projectId?: string
}

interface LeadSource {
  id: string
  name: string
  type: 'portal' | 'social' | 'email' | 'api'
  icon: React.ReactNode
  status: 'connected' | 'disconnected' | 'error'
  enabled: boolean
  totalLeads: number
  newLeads: number
  lastSync?: string
  config?: Record<string, any>
}

export function LeadSourceIntegrations({ projectId }: LeadSourceIntegrationsProps) {
  const { toast } = useToast()
  const [showConfig, setShowConfig] = useState<string | null>(null)
  
  const [sources, setSources] = useState<LeadSource[]>([
    {
      id: '99acres',
      name: '99acres',
      type: 'portal',
      icon: <Globe className="h-5 w-5" />,
      status: 'disconnected',
      enabled: false,
      totalLeads: 0,
      newLeads: 0
    },
    {
      id: 'magicbricks',
      name: 'MagicBricks',
      type: 'portal',
      icon: <Globe className="h-5 w-5" />,
      status: 'connected',
      enabled: true,
      totalLeads: 145,
      newLeads: 8,
      lastSync: '2 hours ago'
    },
    {
      id: 'housing',
      name: 'Housing.com',
      type: 'portal',
      icon: <Globe className="h-5 w-5" />,
      status: 'disconnected',
      enabled: false,
      totalLeads: 0,
      newLeads: 0
    },
    {
      id: 'facebook',
      name: 'Facebook Lead Ads',
      type: 'social',
      icon: <Facebook className="h-5 w-5" />,
      status: 'connected',
      enabled: true,
      totalLeads: 67,
      newLeads: 5,
      lastSync: '1 hour ago'
    },
    {
      id: 'instagram',
      name: 'Instagram Lead Ads',
      type: 'social',
      icon: <Facebook className="h-5 w-5" />,
      status: 'disconnected',
      enabled: false,
      totalLeads: 0,
      newLeads: 0
    },
    {
      id: 'email',
      name: 'Email Parsing',
      type: 'email',
      icon: <Mail className="h-5 w-5" />,
      status: 'disconnected',
      enabled: false,
      totalLeads: 0,
      newLeads: 0
    }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: 'bg-green-100 text-green-800',
      disconnected: 'bg-gray-100 text-gray-800',
      error: 'bg-red-100 text-red-800'
    }
    return variants[status as keyof typeof variants] || variants.disconnected
  }

  const handleToggleSource = (sourceId: string, enabled: boolean) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId ? { ...source, enabled } : source
    ))
    
    toast({
      title: enabled ? "Source enabled" : "Source disabled",
      description: `${sources.find(s => s.id === sourceId)?.name} has been ${enabled ? 'enabled' : 'disabled'}`,
    })
  }

  const handleSync = (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId)
    toast({
      title: "Syncing leads",
      description: `Starting sync for ${source?.name}...`,
    })
    
    // Simulate sync
    setTimeout(() => {
      setSources(prev => prev.map(s => 
        s.id === sourceId 
          ? { ...s, lastSync: 'Just now', newLeads: s.newLeads + Math.floor(Math.random() * 5) }
          : s
      ))
      toast({
        title: "Sync completed",
        description: `Successfully synced leads from ${source?.name}`,
      })
    }, 2000)
  }

  const handleConnect = (sourceId: string) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId ? { ...source, status: 'connected' } : source
    ))
    
    toast({
      title: "Source connected",
      description: `Successfully connected to ${sources.find(s => s.id === sourceId)?.name}`,
    })
  }

  const renderSourceCard = (source: LeadSource) => (
    <Card key={source.id} className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {source.icon}
            <div>
              <CardTitle className="text-base">{source.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(source.status)}
                <Badge className={getStatusBadge(source.status)}>
                  {source.status}
                </Badge>
              </div>
            </div>
          </div>
          <Switch
            checked={source.enabled}
            onCheckedChange={(enabled) => handleToggleSource(source.id, enabled)}
            disabled={source.status !== 'connected'}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Total Leads</div>
            <div className="font-semibold text-lg">{source.totalLeads}</div>
          </div>
          <div>
            <div className="text-muted-foreground">New Leads</div>
            <div className="font-semibold text-lg text-blue-600">{source.newLeads}</div>
          </div>
        </div>
        
        {source.lastSync && (
          <div className="text-xs text-muted-foreground">
            Last sync: {source.lastSync}
          </div>
        )}
        
        <div className="flex gap-2">
          {source.status === 'connected' ? (
            <Button 
              onClick={() => handleSync(source.id)} 
              size="sm" 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-3 w-3" />
              Sync Now
            </Button>
          ) : (
            <Button 
              onClick={() => handleConnect(source.id)} 
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-3 w-3" />
              Connect
            </Button>
          )}
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost">
                <Settings className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{source.name} Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    placeholder="Enter your API key"
                    type="password"
                  />
                </div>
                <div>
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://your-domain.com/webhook"
                    value={`https://your-app.com/api/leads/${projectId}/${source.id}`}
                    readOnly
                  />
                </div>
                <Button className="w-full">Save Configuration</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )

  const portalSources = sources.filter(s => s.type === 'portal')
  const socialSources = sources.filter(s => s.type === 'social')
  const otherSources = sources.filter(s => !['portal', 'social'].includes(s.type))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Sources</h2>
          <p className="text-muted-foreground">Connect and manage your lead sources</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Source
        </Button>
      </div>

      <Tabs defaultValue="portals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="portals">Property Portals</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="other">Other Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="portals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portalSources.map(renderSourceCard)}
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialSources.map(renderSourceCard)}
          </div>
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherSources.map(renderSourceCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {sources.filter(s => s.status === 'connected').length}
              </div>
              <div className="text-sm text-muted-foreground">Connected</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {sources.filter(s => s.enabled).length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {sources.reduce((sum, s) => sum + s.totalLeads, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Leads</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {sources.reduce((sum, s) => sum + s.newLeads, 0)}
              </div>
              <div className="text-sm text-muted-foreground">New Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
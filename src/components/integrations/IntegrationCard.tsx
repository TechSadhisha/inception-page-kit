import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { CheckCircle, AlertCircle, Globe, Zap, MessageSquare, Phone, BarChart3, Settings } from 'lucide-react'
import { IntegrationConfig } from '@/types/integration'

interface IntegrationCardProps {
  integration: IntegrationConfig
  onTest: () => void
  onSync: (dataType: 'leads' | 'properties' | 'campaigns') => void
  onToggle: (isActive: boolean) => void
  isTesting: boolean
  isSyncing: boolean
  isToggling: boolean
}

const typeIcons = {
  portal: Globe,
  marketing: Zap,
  communication: MessageSquare,
  telephony: Phone,
  analytics: BarChart3,
}

const typeColors = {
  portal: 'bg-blue-100 text-blue-800',
  marketing: 'bg-green-100 text-green-800',
  communication: 'bg-purple-100 text-purple-800',
  telephony: 'bg-orange-100 text-orange-800',
  analytics: 'bg-pink-100 text-pink-800',
}

export const IntegrationCard = ({ 
  integration, 
  onTest, 
  onSync, 
  onToggle, 
  isTesting, 
  isSyncing, 
  isToggling 
}: IntegrationCardProps) => {
  const IconComponent = typeIcons[integration.integration_type]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {integration.name}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={typeColors[integration.integration_type]}>
              {integration.integration_type}
            </Badge>
            <Badge variant="outline">
              {integration.provider}
            </Badge>
            {integration.is_active ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={integration.is_active}
            onCheckedChange={onToggle}
            disabled={isToggling}
          />
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Status:</span>
            <div className="font-medium">
              {integration.is_active ? 'Connected' : 'Disconnected'}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Last Sync:</span>
            <div className="font-medium">
              {integration.last_sync_at 
                ? new Date(integration.last_sync_at).toLocaleDateString()
                : 'Never'
              }
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Sync Frequency: </span>
            <span className="text-muted-foreground">
              Every {Math.round(integration.sync_frequency / 3600)} hour(s)
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onTest}
            disabled={!integration.is_active || isTesting}
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </Button>
          
          {integration.integration_type === 'portal' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSync('leads')}
                disabled={!integration.is_active || isSyncing}
              >
                {isSyncing ? 'Syncing...' : 'Sync Leads'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSync('properties')}
                disabled={!integration.is_active || isSyncing}
              >
                Sync Properties
              </Button>
            </>
          )}
          
          {integration.integration_type === 'marketing' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSync('campaigns')}
              disabled={!integration.is_active || isSyncing}
            >
              {isSyncing ? 'Syncing...' : 'Sync Campaigns'}
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Created: {new Date(integration.created_at).toLocaleDateString()}
          {integration.updated_at !== integration.created_at && (
            <span className="ml-2">• Updated: {new Date(integration.updated_at).toLocaleDateString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
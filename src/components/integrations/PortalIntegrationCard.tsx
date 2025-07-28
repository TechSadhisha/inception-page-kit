import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Globe, Download, Upload, Calendar } from 'lucide-react'
import { PortalIntegration } from '@/types/integration'

interface PortalIntegrationCardProps {
  portal: PortalIntegration
  onSync: (dataType: 'leads' | 'properties') => void
  isSyncing: boolean
}

export const PortalIntegrationCard = ({ portal, onSync, isSyncing }: PortalIntegrationCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {portal.portal_name}
          </CardTitle>
          <Badge variant="outline">
            {(portal as any).integration_configs?.provider || 'Portal'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Lead Sync:</span>
            <div className="font-medium">
              {portal.last_lead_sync 
                ? new Date(portal.last_lead_sync).toLocaleDateString()
                : 'Never'
              }
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Property Sync:</span>
            <div className="font-medium">
              {portal.last_property_sync 
                ? new Date(portal.last_property_sync).toLocaleDateString()
                : 'Never'
              }
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Mapping Status: </span>
            <span className="text-muted-foreground">
              {portal.lead_mapping && portal.property_mapping ? 'Configured' : 'Pending'}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSync('leads')}
            disabled={isSyncing}
          >
            <Download className="mr-2 h-3 w-3" />
            {isSyncing ? 'Syncing...' : 'Sync Leads'}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSync('properties')}
            disabled={isSyncing}
          >
            <Upload className="mr-2 h-3 w-3" />
            Sync Properties
          </Button>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Connected: {new Date(portal.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
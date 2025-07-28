
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, AlertCircle, Clock, Download, Settings, Eye } from 'lucide-react'

interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  source: string
  property: string
  budget: string
  createdAt: string
  status: 'new' | 'contacted' | 'converted'
}

interface LeadSourceCardProps {
  source: {
    id: string
    name: string
    enabled: boolean
    lastSync: string | null
    totalLeads: number
    newLeads: number
    status: 'connected' | 'disconnected' | 'syncing' | 'error'
  }
  onSync: (sourceId: string) => void
  onToggle: (sourceId: string, enabled: boolean) => void
  syncing: boolean
}

export const LeadSourceCard = ({ source, onSync, onToggle, syncing }: LeadSourceCardProps) => {
  const [showLeads, setShowLeads] = useState(false)
  
  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      phone: '+91 9876543210',
      email: 'rahul@example.com',
      source: source.name,
      property: '2BHK Apartment in Gurgaon',
      budget: '₹50L - ₹75L',
      createdAt: '2024-01-13T10:30:00Z',
      status: 'new'
    },
    {
      id: '2',
      name: 'Priya Patel',
      phone: '+91 9876543211',
      source: source.name,
      property: '3BHK Villa in Pune',
      budget: '₹1Cr - ₹1.5Cr',
      createdAt: '2024-01-13T09:15:00Z',
      status: 'contacted'
    }
  ]

  const getStatusIcon = (status: typeof source.status) => {
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

  const getStatusBadge = (status: typeof source.status) => {
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{source.name}</CardTitle>
          {getStatusIcon(source.status)}
        </div>
        <div className="flex items-center justify-between">
          {getStatusBadge(source.status)}
          <Switch 
            checked={source.enabled} 
            onCheckedChange={(enabled) => onToggle(source.id, enabled)}
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
            onClick={() => onSync(source.id)}
            disabled={!source.enabled || syncing}
            className="flex-1"
          >
            {syncing ? (
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
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowLeads(!showLeads)}
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="h-3 w-3" />
          </Button>
        </div>

        {showLeads && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">Recent Leads:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {mockLeads.slice(0, 3).map((lead) => (
                <div key={lead.id} className="p-2 border rounded-sm text-xs">
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-muted-foreground">{lead.phone}</div>
                  <div className="text-muted-foreground truncate">{lead.property}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

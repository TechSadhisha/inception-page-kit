import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Users, Target, Globe, Share2, MousePointer } from 'lucide-react'
import { LeadSource } from '@/types/integration'

interface LeadSourceCardProps {
  source: LeadSource
  onToggle: (isActive: boolean) => void
}

const sourceTypeIcons = {
  portal: Globe,
  social: Share2,
  referral: Users,
  direct: MousePointer,
  campaign: Target,
}

const sourceTypeColors = {
  portal: 'bg-blue-100 text-blue-800',
  social: 'bg-green-100 text-green-800',
  referral: 'bg-purple-100 text-purple-800',
  direct: 'bg-orange-100 text-orange-800',
  campaign: 'bg-pink-100 text-pink-800',
}

export const LeadSourceCard = ({ source, onToggle }: LeadSourceCardProps) => {
  const IconComponent = sourceTypeIcons[source.source_type]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {source.name}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={sourceTypeColors[source.source_type]}>
              {source.source_type}
            </Badge>
            <Badge variant={source.is_active ? 'default' : 'secondary'}>
              {source.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
        <Switch
          checked={source.is_active}
          onCheckedChange={onToggle}
        />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total Leads:</span>
            <div className="text-lg font-bold">{source.total_leads}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Qualified:</span>
            <div className="text-lg font-bold text-green-600">{source.qualified_leads}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Conversion Rate</span>
            <span className="font-medium">{source.conversion_rate.toFixed(1)}%</span>
          </div>
          <Progress value={source.conversion_rate} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Quality Score: </span>
            <span className={`${source.conversion_rate > 15 ? 'text-green-600' : 
                              source.conversion_rate > 10 ? 'text-yellow-600' : 
                              'text-red-600'}`}>
              {source.conversion_rate > 15 ? 'High' : 
               source.conversion_rate > 10 ? 'Medium' : 'Low'}
            </span>
          </div>
          
          <div className="text-sm">
            <span className="font-medium">Performance: </span>
            <span className="text-muted-foreground">
              {source.qualified_leads > 0 ? 
                `${Math.round((source.qualified_leads / source.total_leads) * 100)}% qualification rate` :
                'No qualified leads yet'
              }
            </span>
          </div>
        </div>

        {source.tracking_config && (
          <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
            <div className="font-medium">Tracking Configuration:</div>
            {Object.entries(source.tracking_config).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-muted-foreground">{key}:</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Created: {new Date(source.created_at).toLocaleDateString()}
          <span className="ml-2">• Status: {source.is_active ? 'Tracking' : 'Paused'}</span>
        </div>
      </CardContent>
    </Card>
  )
}
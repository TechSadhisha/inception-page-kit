
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { DollarSign, BarChart3, Eye, MousePointer, Users, Facebook, Instagram, MapPin, User, Target, Play, Pause } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  platform: 'facebook' | 'instagram' | 'both'
  status: 'active' | 'paused' | 'draft'
  budget: number
  spent: number
  impressions: number
  clicks: number
  leads: number
  objective: string
  startDate: string
  endDate: string
  locations: string[]
  ageRange: { min: number; max: number }
  interests: string[]
  gender: string
}

interface CampaignCardProps {
  campaign: Campaign
  onToggleStatus: (id: string) => void
}

export const CampaignCard = ({ campaign, onToggleStatus }: CampaignCardProps) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />
      case 'instagram':
        return <Instagram className="h-4 w-4" />
      case 'both':
        return (
          <div className="flex space-x-1">
            <Facebook className="h-3 w-3" />
            <Instagram className="h-3 w-3" />
          </div>
        )
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getPlatformIcon(campaign.platform)}
            <div>
              <CardTitle className="text-lg">{campaign.name}</CardTitle>
              <CardDescription>{campaign.objective}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(campaign.status)}>
              {campaign.status}
            </Badge>
            <Switch
              checked={campaign.status === 'active'}
              onCheckedChange={() => onToggleStatus(campaign.id)}
            />
            {campaign.status === 'active' ? (
              <Pause className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Play className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="font-semibold">₹{campaign.budget.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Spent</p>
              <p className="font-semibold">₹{campaign.spent.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Impressions</p>
              <p className="font-semibold">{campaign.impressions.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MousePointer className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Clicks</p>
              <p className="font-semibold">{campaign.clicks.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Leads</p>
              <p className="font-semibold">{campaign.leads}</p>
            </div>
          </div>
        </div>

        {/* Targeting Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Locations:</span>
            <div className="flex flex-wrap gap-1">
              {campaign.locations.map((location) => (
                <Badge key={location} variant="outline" className="text-xs">
                  {location}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Age: {campaign.ageRange.min}-{campaign.ageRange.max}, Gender: {campaign.gender}
            </span>
          </div>
          {campaign.interests.length > 0 && (
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Interests:</span>
              <div className="flex flex-wrap gap-1">
                {campaign.interests.slice(0, 3).map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {campaign.interests.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{campaign.interests.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {campaign.startDate} - {campaign.endDate}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Edit
            </Button>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

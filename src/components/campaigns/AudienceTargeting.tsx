
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User } from 'lucide-react'

interface AudienceTargetingProps {
  newCampaign: any
  setNewCampaign: (campaign: any) => void
}

// Meta-compatible interests and behaviors for real estate campaigns
const interestOptions = [
  // Real Estate Specific
  'Real estate',
  'Property investment',
  'Real estate investing',
  'Rental property',
  'Commercial real estate',
  'Residential property',
  'Property management',
  'Real estate agents',
  
  // Home & Living
  'Home buying',
  'Home selling', 
  'Home improvement',
  'Interior design',
  'Home decor',
  'Architecture',
  'Construction',
  'Home and garden',
  
  // Financial & Investment
  'Investment',
  'Personal finance',
  'Wealth management',
  'Banking',
  'Mortgage loan',
  'Insurance',
  'Financial planning',
  
  // Luxury & Lifestyle
  'Luxury goods',
  'Luxury travel',
  'High-end fashion',
  'Premium brands',
  'Affluent lifestyle',
  
  // Business
  'Business',
  'Entrepreneurship',
  'Small business',
  'Business finance'
]

export const AudienceTargeting = ({ newCampaign, setNewCampaign }: AudienceTargetingProps) => {
  const handleInterestToggle = (interest: string) => {
    setNewCampaign((prev: any) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((int: string) => int !== interest)
        : [...prev.interests, interest]
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <User className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Audience Targeting</h3>
      </div>
      
      {/* Age Range */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age-min">Minimum Age</Label>
          <Select
            value={newCampaign.ageMin}
            onValueChange={(value) => setNewCampaign({ ...newCampaign, ageMin: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 48 }, (_, i) => i + 18).map((age) => (
                <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="age-max">Maximum Age</Label>
          <Select
            value={newCampaign.ageMax}
            onValueChange={(value) => setNewCampaign({ ...newCampaign, ageMax: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 48 }, (_, i) => i + 18).map((age) => (
                <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={newCampaign.gender}
            onValueChange={(value) => setNewCampaign({ ...newCampaign, gender: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-2">
        <Label>Interests & Behaviors</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-lg p-4">
          {interestOptions.map((interest) => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox
                id={`interest-${interest}`}
                checked={newCampaign.interests.includes(interest)}
                onCheckedChange={() => handleInterestToggle(interest)}
              />
              <label
                htmlFor={`interest-${interest}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {interest}
              </label>
            </div>
          ))}
        </div>
        {newCampaign.interests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {newCampaign.interests.map((interest: string) => (
              <Badge key={interest} variant="outline">
                {interest}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

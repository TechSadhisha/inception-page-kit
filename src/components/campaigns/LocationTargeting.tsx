
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { MapPin } from 'lucide-react'

interface LocationTargetingProps {
  newCampaign: any
  setNewCampaign: (campaign: any) => void
}

// Meta-compatible Indian cities with proper naming for API
const indianCities = [
  'Mumbai', 'New Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 
  'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Puducherry',
  'Coimbatore', 'Kochi', 'Thiruvananthapuram', 'Mysuru', 'Rajkot', 'Faridabad', 'Gwalior', 'Jodhpur'
]

export const LocationTargeting = ({ newCampaign, setNewCampaign }: LocationTargetingProps) => {
  const handleLocationToggle = (city: string) => {
    setNewCampaign((prev: any) => ({
      ...prev,
      locations: prev.locations.includes(city)
        ? prev.locations.filter((loc: string) => loc !== city)
        : [...prev.locations, city]
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Location Targeting *</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded-lg p-4">
        {indianCities.map((city) => (
          <div key={city} className="flex items-center space-x-2">
            <Checkbox
              id={`location-${city}`}
              checked={newCampaign.locations.includes(city)}
              onCheckedChange={() => handleLocationToggle(city)}
            />
            <label
              htmlFor={`location-${city}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {city}
            </label>
          </div>
        ))}
      </div>
      {newCampaign.locations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {newCampaign.locations.map((location: string) => (
            <Badge key={location} variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

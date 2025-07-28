import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation } from 'lucide-react'
import { PropertyListing } from '@/types/property'

interface PropertyMapProps {
  properties: PropertyListing[]
  onPropertySelect: (property: PropertyListing) => void
}

export const PropertyMap = ({ properties, onPropertySelect }: PropertyMapProps) => {
  // Group properties by city for the map view
  const propertiesByCity = properties.reduce((acc, property) => {
    if (!acc[property.city]) {
      acc[property.city] = []
    }
    acc[property.city].push(property)
    return acc
  }, {} as Record<string, PropertyListing[]>)

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`
    } else {
      return `₹${price.toLocaleString()}`
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Property Map View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Interactive Map Coming Soon</p>
            <p className="text-sm">
              We're working on integrating Google Maps to show property locations with interactive markers.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* City-wise property grouping as a temporary map alternative */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(propertiesByCity).map(([city, cityProperties]) => (
          <Card key={city}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {city}
                </div>
                <Badge variant="outline">{cityProperties.length} properties</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cityProperties.slice(0, 5).map((property) => (
                  <div
                    key={property.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onPropertySelect(property)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-1">{property.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{property.address}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{property.property_type}</Badge>
                          <span className="text-xs font-medium text-green-600">
                            {formatPrice(property.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {cityProperties.length > 5 && (
                  <div className="text-center text-sm text-muted-foreground">
                    +{cityProperties.length - 5} more properties
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(propertiesByCity).length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No properties to display on map</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
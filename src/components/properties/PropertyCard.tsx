import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, MapPin, Home, Bed, Bath, Square, DollarSign, Calendar } from 'lucide-react'
import { PropertyListing } from '@/types/property'

interface PropertyCardProps {
  property: PropertyListing
  onEdit: (property: PropertyListing) => void
  onDelete: (id: string) => void
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  sold: 'bg-blue-100 text-blue-800',
  rented: 'bg-purple-100 text-purple-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
}

const typeColors = {
  apartment: 'bg-blue-100 text-blue-800',
  villa: 'bg-green-100 text-green-800',
  plot: 'bg-orange-100 text-orange-800',
  commercial: 'bg-purple-100 text-purple-800',
  warehouse: 'bg-gray-100 text-gray-800',
  office: 'bg-indigo-100 text-indigo-800',
}

export const PropertyCard = ({ property, onEdit, onDelete }: PropertyCardProps) => {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg line-clamp-2">{property.title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={typeColors[property.property_type]}>
              {property.property_type}
            </Badge>
            <Badge variant="outline">
              {property.listing_type}
            </Badge>
            <Badge className={statusColors[property.status]}>
              {property.status}
            </Badge>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(property)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(property.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{property.address}, {property.city}</span>
        </div>

        {/* Property specs */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {property.bedrooms && (
            <div className="flex items-center space-x-1">
              <Bed className="h-3 w-3" />
              <span>{property.bedrooms} BHK</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center space-x-1">
              <Bath className="h-3 w-3" />
              <span>{property.bathrooms} Bath</span>
            </div>
          )}
          {property.area_sqft && (
            <div className="flex items-center space-x-1">
              <Square className="h-3 w-3" />
              <span>{property.area_sqft} sqft</span>
            </div>
          )}
          {property.parking_spaces && (
            <div className="flex items-center space-x-1">
              <Home className="h-3 w-3" />
              <span>{property.parking_spaces} Parking</span>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-lg font-bold text-green-600">
                {formatPrice(property.price)}
              </span>
            </div>
            {property.price_per_sqft && (
              <span className="text-sm text-muted-foreground">
                ₹{property.price_per_sqft}/sqft
              </span>
            )}
          </div>
          
          {property.maintenance_charges && (
            <div className="text-sm text-muted-foreground">
              Maintenance: ₹{property.maintenance_charges.toLocaleString()}/month
            </div>
          )}
        </div>

        {/* Availability */}
        {property.availability_date && (
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Available: {new Date(property.availability_date).toLocaleDateString()}</span>
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Listed: {new Date(property.created_at).toLocaleDateString()}
          {property.last_synced_at && (
            <span className="ml-2">• Synced: {new Date(property.last_synced_at).toLocaleDateString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
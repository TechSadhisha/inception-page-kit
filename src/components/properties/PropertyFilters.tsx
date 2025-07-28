import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Filter, X } from 'lucide-react'
import { useState } from 'react'

interface PropertyFiltersProps {
  filters: {
    city: string
    property_type: string
    listing_type: string
    min_price?: number
    max_price?: number
    status: string
  }
  onFiltersChange: (filters: any) => void
}

export const PropertyFilters = ({ filters, onFiltersChange }: PropertyFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false)

  const clearFilters = () => {
    onFiltersChange({
      city: '',
      property_type: '',
      listing_type: '',
      min_price: undefined,
      max_price: undefined,
      status: 'active'
    })
  }

  const hasActiveFilters = filters.city || filters.property_type || filters.listing_type || 
                          filters.min_price || filters.max_price || filters.status !== 'active'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {Object.values(filters).filter(v => v && v !== 'active').length}
            </span>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={(e) => onFiltersChange({ ...filters, city: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select value={filters.property_type} onValueChange={(value) => onFiltersChange({ ...filters, property_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Listing Type</Label>
                <Select value={filters.listing_type} onValueChange={(value) => onFiltersChange({ ...filters, listing_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All listings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Listings</SelectItem>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="lease">For Lease</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Min Price</Label>
                <Input
                  type="number"
                  placeholder="Min price"
                  value={filters.min_price || ''}
                  onChange={(e) => onFiltersChange({ ...filters, min_price: e.target.value ? parseInt(e.target.value) : undefined })}
                />
              </div>

              <div className="space-y-2">
                <Label>Max Price</Label>
                <Input
                  type="number"
                  placeholder="Max price"
                  value={filters.max_price || ''}
                  onChange={(e) => onFiltersChange({ ...filters, max_price: e.target.value ? parseInt(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
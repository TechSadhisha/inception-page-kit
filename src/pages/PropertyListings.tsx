import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Building, MapPin, DollarSign, FolderSync as Sync, Filter } from 'lucide-react'
import { usePropertyListings } from '@/hooks/usePropertyListings'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { PropertyDialog } from '@/components/properties/PropertyDialog'
import { PropertyFilters } from '@/components/properties/PropertyFilters'
import { PropertyMap } from '@/components/properties/PropertyMap'
import { PropertySync } from '@/components/properties/PropertySync'
import { PropertyListing } from '@/types/property'

const PropertyListings = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    city: '',
    property_type: '',
    listing_type: '',
    min_price: undefined as number | undefined,
    max_price: undefined as number | undefined,
    status: 'active'
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<PropertyListing | null>(null)
  const [activeView, setActiveView] = useState('grid')

  const { 
    properties, 
    isLoading, 
    createProperty, 
    updateProperty, 
    deleteProperty,
    syncProperties,
    isCreating, 
    isUpdating, 
    isDeleting,
    isSyncing
  } = usePropertyListings(filters)

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateProperty = (data: any) => {
    createProperty(data)
    setDialogOpen(false)
  }

  const handleUpdateProperty = (data: any) => {
    if (editingProperty) {
      updateProperty(editingProperty.id, data)
      setEditingProperty(null)
      setDialogOpen(false)
    }
  }

  const handleEditProperty = (property: PropertyListing) => {
    setEditingProperty(property)
    setDialogOpen(true)
  }

  const handleDeleteProperty = (id: string) => {
    if (window.confirm('Are you sure you want to delete this property listing?')) {
      deleteProperty(id)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingProperty(null)
  }

  const handleSyncProperties = (sourceId: string) => {
    syncProperties(sourceId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Property Listings</h1>
          <p className="text-muted-foreground">
            Manage your property inventory with MLS/Portal integration
          </p>
        </div>
        <div className="flex gap-2">
          <PropertySync onSync={handleSyncProperties} isSyncing={isSyncing} />
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <PropertyFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Building className="h-3 w-3" />
            {filteredProperties.length} Properties
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Avg: ₹{Math.round(filteredProperties.reduce((sum, p) => sum + p.price, 0) / filteredProperties.length || 0).toLocaleString()}
          </Badge>
        </div>
        
        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={activeView} className="space-y-4">
        <TabsContent value="grid">
          {filteredProperties.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Properties Found</CardTitle>
                <CardDescription>
                  {properties.length === 0 
                    ? "Get started by adding your first property listing or syncing from MLS/Portals."
                    : "No properties match your search criteria."
                  }
                </CardDescription>
              </CardHeader>
              {properties.length === 0 && (
                <CardContent>
                  <div className="flex gap-2">
                    <Button onClick={() => setDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Property
                    </Button>
                    <PropertySync onSync={handleSyncProperties} isSyncing={isSyncing} />
                  </div>
                </CardContent>
              )}
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onEdit={handleEditProperty}
                  onDelete={handleDeleteProperty}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Property List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{property.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.address}, {property.city}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{property.property_type}</Badge>
                        <Badge variant="outline">{property.listing_type}</Badge>
                        <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                          {property.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">₹{property.price.toLocaleString()}</div>
                      {property.area_sqft && (
                        <div className="text-sm text-muted-foreground">
                          ₹{Math.round(property.price / property.area_sqft)}/sqft
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleEditProperty(property)}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteProperty(property.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <PropertyMap properties={filteredProperties} onPropertySelect={handleEditProperty} />
        </TabsContent>
      </Tabs>

      <PropertyDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        property={editingProperty}
        onSubmit={editingProperty ? handleUpdateProperty : handleCreateProperty}
        isLoading={isCreating || isUpdating}
      />
    </div>
  )
}

export default PropertyListings
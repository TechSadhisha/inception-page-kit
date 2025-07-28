import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { PropertyListing, PropertyInsert, PropertyUpdate } from '@/types/property'
import { useProjects } from '@/hooks/useProjects'

interface PropertyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  property?: PropertyListing | null
  onSubmit: (data: PropertyInsert | PropertyUpdate) => void
  isLoading: boolean
}

export const PropertyDialog = ({ open, onOpenChange, property, onSubmit, isLoading }: PropertyDialogProps) => {
  const { projects } = useProjects()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'apartment' as const,
    listing_type: 'sale' as const,
    address: '',
    city: '',
    state: '',
    pincode: '',
    bedrooms: '',
    bathrooms: '',
    area_sqft: '',
    floor_number: '',
    total_floors: '',
    parking_spaces: '',
    price: '',
    maintenance_charges: '',
    security_deposit: '',
    status: 'active' as const,
    availability_date: '',
    possession_status: 'ready' as const,
    project_id: 'none',
    assigned_to: '',
  })

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description || '',
        property_type: property.property_type as any,
        listing_type: property.listing_type as any,
        address: property.address,
        city: property.city,
        state: property.state,
        pincode: property.pincode || '',
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        area_sqft: property.area_sqft?.toString() || '',
        floor_number: property.floor_number?.toString() || '',
        total_floors: property.total_floors?.toString() || '',
        parking_spaces: property.parking_spaces?.toString() || '',
        price: property.price.toString(),
        maintenance_charges: property.maintenance_charges?.toString() || '',
        security_deposit: property.security_deposit?.toString() || '',
        status: property.status as any,
        availability_date: property.availability_date || '',
        possession_status: (property.possession_status || 'ready') as any,
        project_id: property.project_id || 'none',
        assigned_to: property.assigned_to || '',
      })
    } else {
      setFormData({
        title: '',
        description: '',
        property_type: 'apartment',
        listing_type: 'sale',
        address: '',
        city: '',
        state: '',
        pincode: '',
        bedrooms: '',
        bathrooms: '',
        area_sqft: '',
        floor_number: '',
        total_floors: '',
        parking_spaces: '',
        price: '',
        maintenance_charges: '',
        security_deposit: '',
        status: 'active',
        availability_date: '',
        possession_status: 'ready',
        project_id: 'none',
        assigned_to: '',
      })
    }
  }, [property])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitData = {
      title: formData.title,
      description: formData.description || undefined,
      property_type: formData.property_type,
      listing_type: formData.listing_type,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode || undefined,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
      area_sqft: formData.area_sqft ? parseInt(formData.area_sqft) : undefined,
      floor_number: formData.floor_number ? parseInt(formData.floor_number) : undefined,
      total_floors: formData.total_floors ? parseInt(formData.total_floors) : undefined,
      parking_spaces: formData.parking_spaces ? parseInt(formData.parking_spaces) : undefined,
      price: parseFloat(formData.price),
      maintenance_charges: formData.maintenance_charges ? parseFloat(formData.maintenance_charges) : undefined,
      security_deposit: formData.security_deposit ? parseFloat(formData.security_deposit) : undefined,
      status: formData.status,
      availability_date: formData.availability_date || undefined,
      possession_status: formData.possession_status,
      project_id: formData.project_id && formData.project_id !== 'none' ? formData.project_id : undefined,
      assigned_to: formData.assigned_to || undefined,
    }
    
    onSubmit(submitData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {property ? 'Edit Property Listing' : 'Add New Property Listing'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., 3BHK Apartment in Bandra"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select value={formData.project_id} onValueChange={(value) => setFormData({ ...formData, project_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Project</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed property description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property_type">Property Type *</Label>
                <Select value={formData.property_type} onValueChange={(value: any) => setFormData({ ...formData, property_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label htmlFor="listing_type">Listing Type *</Label>
                <Select value={formData.listing_type} onValueChange={(value: any) => setFormData({ ...formData, listing_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="lease">For Lease</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Location</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Complete address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="Pincode"
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Specifications</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area_sqft">Area (sqft)</Label>
                <Input
                  id="area_sqft"
                  type="number"
                  value={formData.area_sqft}
                  onChange={(e) => setFormData({ ...formData, area_sqft: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parking_spaces">Parking</Label>
                <Input
                  id="parking_spaces"
                  type="number"
                  value={formData.parking_spaces}
                  onChange={(e) => setFormData({ ...formData, parking_spaces: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor_number">Floor Number</Label>
                <Input
                  id="floor_number"
                  type="number"
                  value={formData.floor_number}
                  onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_floors">Total Floors</Label>
                <Input
                  id="total_floors"
                  type="number"
                  value={formData.total_floors}
                  onChange={(e) => setFormData({ ...formData, total_floors: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pricing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance_charges">Maintenance (Monthly)</Label>
                <Input
                  id="maintenance_charges"
                  type="number"
                  value={formData.maintenance_charges}
                  onChange={(e) => setFormData({ ...formData, maintenance_charges: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="security_deposit">Security Deposit</Label>
              <Input
                id="security_deposit"
                type="number"
                value={formData.security_deposit}
                onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="possession_status">Possession Status</Label>
                <Select value={formData.possession_status} onValueChange={(value: any) => setFormData({ ...formData, possession_status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ready">Ready to Move</SelectItem>
                    <SelectItem value="under_construction">Under Construction</SelectItem>
                    <SelectItem value="new_launch">New Launch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability_date">Availability Date</Label>
                <Input
                  id="availability_date"
                  type="date"
                  value={formData.availability_date}
                  onChange={(e) => setFormData({ ...formData, availability_date: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
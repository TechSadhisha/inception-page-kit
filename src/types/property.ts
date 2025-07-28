export interface PropertyListing {
  id: string
  mls_id?: string
  portal_id?: string
  source_id?: string
  project_id?: string
  
  // Basic info
  title: string
  description?: string
  property_type: 'apartment' | 'villa' | 'plot' | 'commercial' | 'warehouse' | 'office'
  listing_type: 'sale' | 'rent' | 'lease'
  
  // Location
  address: string
  city: string
  state: string
  pincode?: string
  latitude?: number
  longitude?: number
  
  // Specifications
  bedrooms?: number
  bathrooms?: number
  area_sqft?: number
  area_sqm?: number
  floor_number?: number
  total_floors?: number
  parking_spaces?: number
  
  // Pricing
  price: number
  price_per_sqft?: number
  maintenance_charges?: number
  security_deposit?: number
  
  // Status
  status: 'active' | 'sold' | 'rented' | 'inactive' | 'pending'
  availability_date?: string
  possession_status?: 'ready' | 'under_construction' | 'new_launch'
  
  // Metadata
  created_by: string
  assigned_to?: string
  last_synced_at?: string
  created_at: string
  updated_at: string
}

export interface PropertyMedia {
  id: string
  property_id: string
  media_type: 'image' | 'video' | 'document' | 'floor_plan' | 'virtual_tour'
  file_url: string
  file_name?: string
  file_size?: number
  display_order: number
  is_primary: boolean
  created_at: string
}

export interface PropertyFeature {
  id: string
  property_id: string
  feature_category: string
  feature_name: string
  feature_value?: string
  created_at: string
}

export interface ListingSource {
  id: string
  name: string
  type: 'mls' | 'portal' | 'manual' | 'api'
  api_endpoint?: string
  api_key?: string
  webhook_url?: string
  sync_frequency: number
  is_active: boolean
  last_sync_at?: string
  created_at: string
}

export interface PropertyInsert {
  title: string
  description?: string
  property_type: 'apartment' | 'villa' | 'plot' | 'commercial' | 'warehouse' | 'office'
  listing_type: 'sale' | 'rent' | 'lease'
  address: string
  city: string
  state: string
  pincode?: string
  latitude?: number
  longitude?: number
  bedrooms?: number
  bathrooms?: number
  area_sqft?: number
  area_sqm?: number
  floor_number?: number
  total_floors?: number
  parking_spaces?: number
  price: number
  price_per_sqft?: number
  maintenance_charges?: number
  security_deposit?: number
  status?: 'active' | 'sold' | 'rented' | 'inactive' | 'pending'
  availability_date?: string
  possession_status?: 'ready' | 'under_construction' | 'new_launch'
  project_id?: string
  assigned_to?: string
}

export interface PropertyUpdate {
  title?: string
  description?: string
  property_type?: 'apartment' | 'villa' | 'plot' | 'commercial' | 'warehouse' | 'office'
  listing_type?: 'sale' | 'rent' | 'lease'
  address?: string
  city?: string
  state?: string
  pincode?: string
  latitude?: number
  longitude?: number
  bedrooms?: number
  bathrooms?: number
  area_sqft?: number
  area_sqm?: number
  floor_number?: number
  total_floors?: number
  parking_spaces?: number
  price?: number
  price_per_sqft?: number
  maintenance_charges?: number
  security_deposit?: number
  status?: 'active' | 'sold' | 'rented' | 'inactive' | 'pending'
  availability_date?: string
  possession_status?: 'ready' | 'under_construction' | 'new_launch'
  assigned_to?: string
}
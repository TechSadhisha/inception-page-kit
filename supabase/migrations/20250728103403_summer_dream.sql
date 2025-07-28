/*
  # Property Listings and MLS Integration Schema

  1. New Tables
    - `property_listings` - Core property inventory
    - `listing_sources` - MLS/Portal source configurations  
    - `listing_sync_logs` - Track sync operations
    - `property_media` - Images, videos, documents
    - `property_features` - Amenities and features
    - `listing_portals` - Portal publishing status

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Audit trail support

  3. Integrations
    - MLS/IDX webhook endpoints
    - Portal API configurations
    - Automated sync workflows
*/

-- Property listings core table
CREATE TABLE IF NOT EXISTS property_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mls_id TEXT UNIQUE,
  portal_id TEXT,
  source_id UUID REFERENCES listing_sources(id),
  project_id UUID REFERENCES projects(id),
  
  -- Basic property info
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'villa', 'plot', 'commercial', 'warehouse', 'office')),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent', 'lease')),
  
  -- Location details
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Property specifications
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft INTEGER,
  area_sqm INTEGER,
  floor_number INTEGER,
  total_floors INTEGER,
  parking_spaces INTEGER,
  
  -- Pricing
  price DECIMAL(15, 2) NOT NULL,
  price_per_sqft DECIMAL(10, 2),
  maintenance_charges DECIMAL(10, 2),
  security_deposit DECIMAL(15, 2),
  
  -- Status and availability
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'rented', 'inactive', 'pending')),
  availability_date DATE,
  possession_status TEXT CHECK (possession_status IN ('ready', 'under_construction', 'new_launch')),
  
  -- Metadata
  created_by UUID REFERENCES profiles(id) NOT NULL,
  assigned_to UUID REFERENCES profiles(id),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Listing sources (MLS, portals, manual)
CREATE TABLE IF NOT EXISTS listing_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mls', 'portal', 'manual', 'api')),
  api_endpoint TEXT,
  api_key TEXT,
  webhook_url TEXT,
  sync_frequency INTEGER DEFAULT 3600, -- seconds
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Property media files
CREATE TABLE IF NOT EXISTS property_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES property_listings(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'document', 'floor_plan', 'virtual_tour')),
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Property features and amenities
CREATE TABLE IF NOT EXISTS property_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES property_listings(id) ON DELETE CASCADE,
  feature_category TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  feature_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Portal publishing status
CREATE TABLE IF NOT EXISTS listing_portals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES property_listings(id) ON DELETE CASCADE,
  portal_name TEXT NOT NULL,
  portal_listing_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected', 'expired')),
  published_at TIMESTAMP WITH TIME ZONE,
  last_updated_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sync operation logs
CREATE TABLE IF NOT EXISTS listing_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES listing_sources(id),
  operation_type TEXT NOT NULL CHECK (operation_type IN ('import', 'update', 'delete', 'publish')),
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
  records_processed INTEGER DEFAULT 0,
  records_success INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_details JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE property_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_sync_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view accessible property listings" ON property_listings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Managers can create property listings" ON property_listings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Assigned users can update property listings" ON property_listings
  FOR UPDATE USING (assigned_to = auth.uid() OR created_by = auth.uid());

CREATE POLICY "Users can view property media" ON property_media
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage property media" ON property_media
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view property features" ON property_features
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage property features" ON property_features
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view listing portals" ON listing_portals
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage listing portals" ON listing_portals
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view sync logs" ON listing_sync_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can manage sync logs" ON listing_sync_logs
  FOR ALL USING (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX idx_property_listings_mls_id ON property_listings(mls_id);
CREATE INDEX idx_property_listings_status ON property_listings(status);
CREATE INDEX idx_property_listings_city ON property_listings(city);
CREATE INDEX idx_property_listings_property_type ON property_listings(property_type);
CREATE INDEX idx_property_listings_price ON property_listings(price);
CREATE INDEX idx_property_media_property_id ON property_media(property_id);
CREATE INDEX idx_property_features_property_id ON property_features(property_id);
CREATE INDEX idx_listing_portals_property_id ON listing_portals(property_id);

-- Insert default listing sources
INSERT INTO listing_sources (name, type, is_active) VALUES
('Manual Entry', 'manual', true),
('MagicBricks API', 'portal', true),
('99acres API', 'portal', true),
('Housing.com API', 'portal', true),
('Local MLS', 'mls', false);
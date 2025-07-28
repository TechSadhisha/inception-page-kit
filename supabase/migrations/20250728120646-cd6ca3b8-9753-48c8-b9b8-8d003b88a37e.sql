-- Create missing tables for integrations functionality

-- Integration configurations table
CREATE TABLE public.integration_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  integration_type TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Portal integrations table  
CREATE TABLE public.portal_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id UUID NOT NULL,
  portal_name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead sources table
CREATE TABLE public.lead_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  total_leads INTEGER DEFAULT 0,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Property listings table for MLS/IDX integration
CREATE TABLE public.property_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  external_id TEXT,
  property_type TEXT NOT NULL DEFAULT 'apartment',
  listing_type TEXT NOT NULL DEFAULT 'sale',
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(15,2),
  address TEXT,
  city TEXT,
  state TEXT,
  zipcode TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  availability_status TEXT NOT NULL DEFAULT 'ready',
  images JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  source_portal TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.integration_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for integration_configs
CREATE POLICY "Users can view their own integration configs" 
ON public.integration_configs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own integration configs" 
ON public.integration_configs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integration configs" 
ON public.integration_configs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integration configs" 
ON public.integration_configs 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for portal_integrations
CREATE POLICY "Users can view portal integrations for their configs" 
ON public.portal_integrations 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM integration_configs ic 
  WHERE ic.id = portal_integrations.integration_id 
  AND ic.user_id = auth.uid()
));

CREATE POLICY "Users can manage portal integrations for their configs" 
ON public.portal_integrations 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM integration_configs ic 
  WHERE ic.id = portal_integrations.integration_id 
  AND ic.user_id = auth.uid()
));

-- RLS Policies for lead_sources
CREATE POLICY "Users can view their own lead sources" 
ON public.lead_sources 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own lead sources" 
ON public.lead_sources 
FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for property_listings
CREATE POLICY "Users can view their own property listings" 
ON public.property_listings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own property listings" 
ON public.property_listings 
FOR ALL
USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_integration_configs_user_id ON public.integration_configs(user_id);
CREATE INDEX idx_portal_integrations_integration_id ON public.portal_integrations(integration_id);
CREATE INDEX idx_lead_sources_user_id ON public.lead_sources(user_id);
CREATE INDEX idx_property_listings_user_id ON public.property_listings(user_id);
CREATE INDEX idx_property_listings_external_id ON public.property_listings(external_id);

-- Add update triggers
CREATE TRIGGER update_integration_configs_updated_at
BEFORE UPDATE ON public.integration_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portal_integrations_updated_at
BEFORE UPDATE ON public.portal_integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_sources_updated_at
BEFORE UPDATE ON public.lead_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_property_listings_updated_at
BEFORE UPDATE ON public.property_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
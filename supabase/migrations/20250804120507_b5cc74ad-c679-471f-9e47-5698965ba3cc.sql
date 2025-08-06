-- Create companies table for multi-tenant architecture
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Add company_id to profiles table
ALTER TABLE public.profiles ADD COLUMN company_id UUID REFERENCES public.companies(id);

-- Create company admin role enum
CREATE TYPE public.company_role AS ENUM ('company_admin', 'employee');

-- Add company role to profiles
ALTER TABLE public.profiles ADD COLUMN company_role public.company_role DEFAULT 'employee';

-- Add company_id to knowledge_videos for data isolation
ALTER TABLE public.knowledge_videos ADD COLUMN company_id UUID REFERENCES public.companies(id);

-- Add company_id to projects for data isolation  
ALTER TABLE public.projects ADD COLUMN company_id UUID REFERENCES public.companies(id);

-- Add company_id to prospects for data isolation
ALTER TABLE public.prospects ADD COLUMN company_id UUID REFERENCES public.companies(id);

-- Add company_id to other relevant tables
ALTER TABLE public.property_listings ADD COLUMN company_id UUID REFERENCES public.companies(id);
ALTER TABLE public.lead_sources ADD COLUMN company_id UUID REFERENCES public.companies(id);
ALTER TABLE public.integration_configs ADD COLUMN company_id UUID REFERENCES public.companies(id);

-- Create RLS policies for companies
CREATE POLICY "Company admins can manage their own company" 
ON public.companies 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = companies.id 
    AND profiles.company_role = 'company_admin'
  )
);

CREATE POLICY "Users can view their own company" 
ON public.companies 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = companies.id
  )
);

-- Update profiles RLS policies for company isolation
DROP POLICY IF EXISTS "Allow all authenticated users full access" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Company admins can view company profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin_profile
    WHERE admin_profile.id = auth.uid() 
    AND admin_profile.company_id = profiles.company_id 
    AND admin_profile.company_role = 'company_admin'
  )
);

-- Update knowledge_videos RLS for company isolation
DROP POLICY IF EXISTS "Users can view all knowledge videos" ON public.knowledge_videos;
DROP POLICY IF EXISTS "Users can create knowledge videos" ON public.knowledge_videos;
DROP POLICY IF EXISTS "Users can update their own knowledge videos" ON public.knowledge_videos;
DROP POLICY IF EXISTS "Users can delete their own knowledge videos" ON public.knowledge_videos;

CREATE POLICY "Users can view company knowledge videos" 
ON public.knowledge_videos 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = knowledge_videos.company_id
  )
);

CREATE POLICY "Users can create company knowledge videos" 
ON public.knowledge_videos 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = knowledge_videos.company_id
  )
);

CREATE POLICY "Users can update their own knowledge videos" 
ON public.knowledge_videos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own knowledge videos" 
ON public.knowledge_videos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Update projects RLS for company isolation
DROP POLICY IF EXISTS "Users can view accessible projects" ON public.projects;
DROP POLICY IF EXISTS "Admins and managers can create projects" ON public.projects;
DROP POLICY IF EXISTS "Project creators and admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;

CREATE POLICY "Users can view company projects" 
ON public.projects 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = projects.company_id
  )
);

CREATE POLICY "Company users can create projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = projects.company_id
  )
);

CREATE POLICY "Project creators and company admins can update projects" 
ON public.projects 
FOR UPDATE 
USING (
  (created_by = auth.uid()) OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = projects.company_id 
    AND profiles.company_role = 'company_admin'
  )
);

CREATE POLICY "Company admins can delete projects" 
ON public.projects 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = projects.company_id 
    AND profiles.company_role = 'company_admin'
  )
);

-- Update prospects RLS for company isolation
DROP POLICY IF EXISTS "Users can view accessible prospects" ON public.prospects;
DROP POLICY IF EXISTS "Managers and admins can create prospects" ON public.prospects;
DROP POLICY IF EXISTS "Assigned users and managers can update prospects" ON public.prospects;
DROP POLICY IF EXISTS "Admins and managers can delete prospects" ON public.prospects;

CREATE POLICY "Users can view company prospects" 
ON public.prospects 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = prospects.company_id
  )
);

CREATE POLICY "Company users can create prospects" 
ON public.prospects 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = prospects.company_id
  )
);

CREATE POLICY "Company users can update prospects" 
ON public.prospects 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = prospects.company_id
  )
);

CREATE POLICY "Company admins can delete prospects" 
ON public.prospects 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = prospects.company_id 
    AND profiles.company_role = 'company_admin'
  )
);

-- Update property_listings RLS for company isolation
DROP POLICY IF EXISTS "Users can manage their own property listings" ON public.property_listings;
DROP POLICY IF EXISTS "Users can view their own property listings" ON public.property_listings;

CREATE POLICY "Users can manage company property listings" 
ON public.property_listings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = property_listings.company_id
  )
);

-- Update lead_sources RLS for company isolation  
DROP POLICY IF EXISTS "Users can manage their own lead sources" ON public.lead_sources;
DROP POLICY IF EXISTS "Users can view their own lead sources" ON public.lead_sources;

CREATE POLICY "Users can manage company lead sources" 
ON public.lead_sources 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = lead_sources.company_id
  )
);

-- Update integration_configs RLS for company isolation
DROP POLICY IF EXISTS "Users can view their own integration configs" ON public.integration_configs;
DROP POLICY IF EXISTS "Users can create their own integration configs" ON public.integration_configs;
DROP POLICY IF EXISTS "Users can update their own integration configs" ON public.integration_configs;
DROP POLICY IF EXISTS "Users can delete their own integration configs" ON public.integration_configs;

CREATE POLICY "Users can manage company integration configs" 
ON public.integration_configs 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = integration_configs.company_id
  )
);

-- Create function to get user's company role
CREATE OR REPLACE FUNCTION public.get_user_company_role(_user_id uuid)
RETURNS company_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT company_role
  FROM public.profiles
  WHERE id = _user_id
$$;

-- Create function to check if user is company admin
CREATE OR REPLACE FUNCTION public.is_company_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT company_role = 'company_admin'
  FROM public.profiles
  WHERE id = _user_id
$$;

-- Create trigger to auto-update company_id on insert for relevant tables
CREATE OR REPLACE FUNCTION public.set_user_company_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Set company_id from user's profile
  SELECT company_id INTO NEW.company_id
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers to auto-set company_id
CREATE TRIGGER set_knowledge_videos_company_id
  BEFORE INSERT ON public.knowledge_videos
  FOR EACH ROW
  WHEN (NEW.company_id IS NULL)
  EXECUTE FUNCTION public.set_user_company_id();

CREATE TRIGGER set_projects_company_id
  BEFORE INSERT ON public.projects
  FOR EACH ROW
  WHEN (NEW.company_id IS NULL)
  EXECUTE FUNCTION public.set_user_company_id();

CREATE TRIGGER set_prospects_company_id
  BEFORE INSERT ON public.prospects
  FOR EACH ROW
  WHEN (NEW.company_id IS NULL)
  EXECUTE FUNCTION public.set_user_company_id();

CREATE TRIGGER set_property_listings_company_id
  BEFORE INSERT ON public.property_listings
  FOR EACH ROW
  WHEN (NEW.company_id IS NULL)
  EXECUTE FUNCTION public.set_user_company_id();

CREATE TRIGGER set_lead_sources_company_id
  BEFORE INSERT ON public.lead_sources
  FOR EACH ROW
  WHEN (NEW.company_id IS NULL)
  EXECUTE FUNCTION public.set_user_company_id();

CREATE TRIGGER set_integration_configs_company_id
  BEFORE INSERT ON public.integration_configs
  FOR EACH ROW
  WHEN (NEW.company_id IS NULL)
  EXECUTE FUNCTION public.set_user_company_id();
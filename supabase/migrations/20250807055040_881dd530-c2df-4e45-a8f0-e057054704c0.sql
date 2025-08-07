-- Fix RLS policies for prospects to handle users without company_id
-- Drop existing policies
DROP POLICY IF EXISTS "Company users can create prospects" ON public.prospects;
DROP POLICY IF EXISTS "Company users can update prospects" ON public.prospects;
DROP POLICY IF EXISTS "Users can view company prospects" ON public.prospects;
DROP POLICY IF EXISTS "Company admins can delete prospects" ON public.prospects;

-- Create new policies that handle both company and individual users
CREATE POLICY "Users can create prospects" 
ON public.prospects 
FOR INSERT 
WITH CHECK (
  -- Allow if user has a company and prospect belongs to same company
  (EXISTS ( 
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id IS NOT NULL 
    AND profiles.company_id = prospects.company_id
  ))
  OR
  -- Allow if user has no company and prospect has no company
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id IS NULL 
    AND prospects.company_id IS NULL
  ))
);

CREATE POLICY "Users can view accessible prospects" 
ON public.prospects 
FOR SELECT 
USING (
  -- Allow if user has a company and prospect belongs to same company
  (EXISTS ( 
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id IS NOT NULL 
    AND profiles.company_id = prospects.company_id
  ))
  OR
  -- Allow if user has no company and prospect has no company
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id IS NULL 
    AND prospects.company_id IS NULL
  ))
);

CREATE POLICY "Users can update accessible prospects" 
ON public.prospects 
FOR UPDATE 
USING (
  -- Allow if user has a company and prospect belongs to same company
  (EXISTS ( 
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id IS NOT NULL 
    AND profiles.company_id = prospects.company_id
  ))
  OR
  -- Allow if user has no company and prospect has no company
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id IS NULL 
    AND prospects.company_id IS NULL
  ))
);

CREATE POLICY "Users can delete accessible prospects" 
ON public.prospects 
FOR DELETE 
USING (
  -- Allow if user has a company and is company admin
  (EXISTS ( 
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id IS NOT NULL 
    AND profiles.company_id = prospects.company_id 
    AND profiles.company_role = 'company_admin'::company_role
  ))
  OR
  -- Allow if user has no company and prospect has no company
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id IS NULL 
    AND prospects.company_id IS NULL
  ))
);
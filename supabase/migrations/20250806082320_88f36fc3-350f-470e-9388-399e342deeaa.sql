-- Fix projects table RLS policies to handle company_id properly
-- First, let's update the trigger to set company_id automatically
CREATE OR REPLACE FUNCTION public.set_project_company_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Set company_id from user's profile
  SELECT company_id INTO NEW.company_id
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- If no company_id, allow the project to be created without one for now
  -- This handles cases where users don't have a company assigned yet
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically set company_id
DROP TRIGGER IF EXISTS set_project_company_id_trigger ON public.projects;
CREATE TRIGGER set_project_company_id_trigger
  BEFORE INSERT ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_project_company_id();

-- Update the RLS policy to be more permissive for project creation
DROP POLICY IF EXISTS "Company users can create projects" ON public.projects;

-- Create a more flexible policy that allows users to create projects
-- either with their company_id or without one (for users without companies)
CREATE POLICY "Users can create projects"
ON public.projects
FOR INSERT
WITH CHECK (
  (created_by = auth.uid()) AND 
  (
    -- User has no company (company_id can be null)
    company_id IS NULL OR
    -- User's company matches the project's company
    EXISTS (
      SELECT 1 
      FROM profiles 
      WHERE id = auth.uid() 
      AND company_id = projects.company_id
    )
  )
);

-- Also update the SELECT policy to handle users without companies
DROP POLICY IF EXISTS "Users can view company projects" ON public.projects;

CREATE POLICY "Users can view accessible projects"
ON public.projects
FOR SELECT
USING (
  -- User created the project
  created_by = auth.uid() OR
  -- User shares the same company (if both have companies)
  (
    company_id IS NOT NULL AND
    EXISTS (
      SELECT 1 
      FROM profiles 
      WHERE id = auth.uid() 
      AND company_id = projects.company_id
    )
  )
);
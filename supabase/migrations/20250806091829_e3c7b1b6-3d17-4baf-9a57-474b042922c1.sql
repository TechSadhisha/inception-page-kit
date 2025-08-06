-- Fix the search_path security issue for the new function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
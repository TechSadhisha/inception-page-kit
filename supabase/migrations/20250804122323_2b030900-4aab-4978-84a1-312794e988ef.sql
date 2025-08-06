-- Fix infinite recursion in profiles RLS policies
-- The issue is that the "Company admins can view company profiles" policy 
-- references the profiles table within itself, causing infinite recursion

-- Drop the problematic policy
DROP POLICY IF EXISTS "Company admins can view company profiles" ON public.profiles;

-- Create a new policy that avoids recursion by using auth.uid() directly
-- We'll create a function to get the current user's company_id and role
CREATE OR REPLACE FUNCTION public.get_current_user_company() 
RETURNS TABLE(company_id uuid, company_role company_role)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.company_id, p.company_role 
  FROM profiles p 
  WHERE p.id = auth.uid()
  LIMIT 1;
$$;

-- Create a new policy that uses the function to avoid recursion
CREATE POLICY "Company members can view company profiles" ON public.profiles
FOR SELECT
USING (
  -- Users can see their own profile
  auth.uid() = id 
  OR 
  -- Company admins can see all profiles in their company
  (
    EXISTS (
      SELECT 1 FROM public.get_current_user_company() curr
      WHERE curr.company_role = 'company_admin' 
      AND curr.company_id = profiles.company_id
    )
  )
  OR
  -- Regular employees can see other profiles in their company
  (
    EXISTS (
      SELECT 1 FROM public.get_current_user_company() curr
      WHERE curr.company_id = profiles.company_id
    )
  )
);

-- Also ensure the knowledge_videos table has proper RLS policies
DROP POLICY IF EXISTS "Users can view knowledge videos in their company" ON public.knowledge_videos;

CREATE POLICY "Users can view knowledge videos in their company" ON public.knowledge_videos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.get_current_user_company() curr, profiles p
    WHERE p.id = knowledge_videos.user_id 
    AND p.company_id = curr.company_id
  )
);

-- Fix other potential RLS policy issues
DROP POLICY IF EXISTS "Users can insert knowledge videos" ON public.knowledge_videos;

CREATE POLICY "Users can insert knowledge videos" ON public.knowledge_videos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update knowledge videos" ON public.knowledge_videos;

CREATE POLICY "Users can update knowledge videos" ON public.knowledge_videos
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete knowledge videos" ON public.knowledge_videos;

CREATE POLICY "Users can delete knowledge videos" ON public.knowledge_videos
FOR DELETE
USING (auth.uid() = user_id);
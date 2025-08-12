-- Fix overly permissive SELECT policy on user_invitations
-- 1) Drop the existing policy that allowed anyone to read all invitations
DROP POLICY IF EXISTS "Users can view invitations by email" ON public.user_invitations;

-- 2) Create a restrictive policy so users only see invitations addressed to their own email
-- Admins still retain full access via existing "Admins can manage invitations" (ALL) policy
CREATE POLICY "Users can view invitations sent to their email"
ON public.user_invitations
FOR SELECT
USING (
  lower(email) = lower((auth.jwt() ->> 'email'))
);

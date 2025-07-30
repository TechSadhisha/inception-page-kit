-- Add unique constraint for facebook_integrations upsert conflict resolution
ALTER TABLE public.facebook_integrations 
ADD CONSTRAINT facebook_integrations_user_facebook_unique 
UNIQUE (user_id, facebook_user_id);
-- Create table for storing Facebook OAuth tokens
CREATE TABLE public.facebook_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  facebook_user_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  ad_account_id TEXT,
  ad_account_name TEXT,
  business_id TEXT,
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, facebook_user_id)
);

-- Enable RLS
ALTER TABLE public.facebook_integrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own Facebook integrations"
ON public.facebook_integrations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Facebook integrations"
ON public.facebook_integrations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Facebook integrations"
ON public.facebook_integrations
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Facebook integrations"
ON public.facebook_integrations
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_facebook_integrations_updated_at
BEFORE UPDATE ON public.facebook_integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_facebook_integrations_user_id ON public.facebook_integrations(user_id);
CREATE INDEX idx_facebook_integrations_facebook_user_id ON public.facebook_integrations(facebook_user_id);
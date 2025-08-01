-- Create table for storing Meta campaigns
CREATE TABLE IF NOT EXISTS public.meta_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  campaign_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  ad_account_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing Meta leads
CREATE TABLE IF NOT EXISTS public.meta_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lead_id TEXT NOT NULL,
  campaign_id TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  campaign_status TEXT NOT NULL,
  ad_id TEXT NOT NULL,
  ad_name TEXT NOT NULL,
  lead_form_id TEXT NOT NULL,
  created_time TIMESTAMP WITH TIME ZONE NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.meta_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for meta_campaigns
CREATE POLICY "Users can manage their own Meta campaigns" 
ON public.meta_campaigns 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for meta_leads
CREATE POLICY "Users can manage their own Meta leads" 
ON public.meta_leads 
FOR ALL 
USING (auth.uid() = user_id);

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_meta_campaigns_user_campaign 
ON public.meta_campaigns (user_id, campaign_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_meta_leads_user_lead 
ON public.meta_leads (user_id, lead_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meta_campaigns_user_id ON public.meta_campaigns (user_id);
CREATE INDEX IF NOT EXISTS idx_meta_leads_user_id ON public.meta_leads (user_id);
CREATE INDEX IF NOT EXISTS idx_meta_leads_campaign_id ON public.meta_leads (campaign_id);
CREATE INDEX IF NOT EXISTS idx_meta_leads_created_time ON public.meta_leads (created_time);

-- Add triggers for updated_at
CREATE TRIGGER update_meta_campaigns_updated_at
  BEFORE UPDATE ON public.meta_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meta_leads_updated_at
  BEFORE UPDATE ON public.meta_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
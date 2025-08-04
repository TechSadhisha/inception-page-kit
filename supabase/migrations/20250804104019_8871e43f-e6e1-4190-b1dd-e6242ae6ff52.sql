-- Add product_keys table for manual verification system
CREATE TABLE public.product_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_key TEXT NOT NULL UNIQUE,
  plan_id UUID NOT NULL,
  issued_by UUID NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add upgrade_requests table to track email requests
CREATE TABLE public.upgrade_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  company_name TEXT,
  requirements TEXT,
  requested_plan_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_by UUID,
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.product_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upgrade_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for product_keys
CREATE POLICY "Users can view their own product keys" 
ON public.product_keys 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all product keys" 
ON public.product_keys 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for upgrade_requests
CREATE POLICY "Users can view their own upgrade requests" 
ON public.upgrade_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own upgrade requests" 
ON public.upgrade_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all upgrade requests" 
ON public.upgrade_requests 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_product_keys_updated_at
BEFORE UPDATE ON public.product_keys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_upgrade_requests_updated_at
BEFORE UPDATE ON public.upgrade_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check if user has valid product key
CREATE OR REPLACE FUNCTION public.has_valid_product_key(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.product_keys pk
    JOIN public.subscription_plans sp ON pk.plan_id = sp.id
    WHERE pk.user_id = _user_id
      AND pk.is_active = true
      AND pk.expires_at > now()
  )
$$;

-- Function to get user's current product key plan
CREATE OR REPLACE FUNCTION public.get_user_product_key_plan(_user_id UUID)
RETURNS TABLE(plan_name TEXT, expires_at TIMESTAMP WITH TIME ZONE)
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT sp.name, pk.expires_at
  FROM public.product_keys pk
  JOIN public.subscription_plans sp ON pk.plan_id = sp.id
  WHERE pk.user_id = _user_id
    AND pk.is_active = true
    AND pk.expires_at > now()
  ORDER BY pk.expires_at DESC
  LIMIT 1
$$;
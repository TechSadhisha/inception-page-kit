-- Fix remaining database functions with proper search_path
CREATE OR REPLACE FUNCTION public.get_user_company_role(_user_id uuid)
RETURNS company_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT company_role
  FROM public.profiles
  WHERE id = _user_id
$function$;

CREATE OR REPLACE FUNCTION public.is_company_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT company_role = 'company_admin'
  FROM public.profiles
  WHERE id = _user_id
$function$;

CREATE OR REPLACE FUNCTION public.has_valid_product_key(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.product_keys pk
    JOIN public.subscription_plans sp ON pk.plan_id = sp.id
    WHERE pk.user_id = _user_id
      AND pk.is_active = true
      AND pk.expires_at > now()
  )
$function$;

CREATE OR REPLACE FUNCTION public.get_user_product_key_plan(_user_id uuid)
RETURNS TABLE(plan_name text, expires_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT sp.name, pk.expires_at
  FROM public.product_keys pk
  JOIN public.subscription_plans sp ON pk.plan_id = sp.id
  WHERE pk.user_id = _user_id
    AND pk.is_active = true
    AND pk.expires_at > now()
  ORDER BY pk.expires_at DESC
  LIMIT 1
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_company()
RETURNS TABLE(company_id uuid, company_role company_role)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT p.company_id, p.company_role 
  FROM profiles p 
  WHERE p.id = auth.uid()
  LIMIT 1;
$function$;
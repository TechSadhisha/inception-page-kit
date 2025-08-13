-- Fix remaining trigger functions with proper search_path
CREATE OR REPLACE FUNCTION public.update_prospect_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_user_company_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Set company_id from user's profile
  SELECT company_id INTO NEW.company_id
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_project_company_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Set company_id from user's profile
  SELECT company_id INTO NEW.company_id
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- If no company_id, allow the project to be created without one for now
  -- This handles cases where users don't have a company assigned yet
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_prospect_date_added()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.date_added IS NULL THEN
    NEW.date_added := NEW.created_at;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_days_in_followup(date_added_param timestamp with time zone, follow_ups_param jsonb)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  latest_followup_date TIMESTAMP WITH TIME ZONE;
  followup_record JSONB;
BEGIN
  -- Get the latest follow-up date
  latest_followup_date := NULL;
  
  FOR followup_record IN SELECT * FROM jsonb_array_elements(follow_ups_param)
  LOOP
    IF followup_record->>'date' IS NOT NULL THEN
      IF latest_followup_date IS NULL OR 
         (followup_record->>'date')::TIMESTAMP WITH TIME ZONE > latest_followup_date THEN
        latest_followup_date := (followup_record->>'date')::TIMESTAMP WITH TIME ZONE;
      END IF;
    END IF;
  END LOOP;
  
  -- Calculate days between date_added and latest follow-up (or today)
  IF latest_followup_date IS NOT NULL THEN
    RETURN EXTRACT(DAY FROM latest_followup_date - date_added_param)::INTEGER;
  ELSE
    RETURN EXTRACT(DAY FROM NOW() - date_added_param)::INTEGER;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.initialize_trial_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  trial_plan_id UUID;
BEGIN
  -- Get the trial plan
  SELECT id INTO trial_plan_id 
  FROM public.subscription_plans 
  WHERE name = 'Free Trial' 
  LIMIT 1;

  -- Create trial subscription for new user
  INSERT INTO public.subscriptions (
    user_id,
    plan_id,
    status,
    trial_start_date,
    trial_end_date,
    is_trial,
    trial_days
  ) VALUES (
    NEW.id,
    trial_plan_id,
    'trial',
    now(),
    now() + interval '14 days',
    true,
    14
  );

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_subscription_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    company_id,
    company_role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'company_id')::uuid, NULL),
    COALESCE((NEW.raw_user_meta_data->>'company_role')::company_role, 'employee'::company_role)
  );
  RETURN NEW;
END;
$function$;
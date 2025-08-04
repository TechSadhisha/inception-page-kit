-- Update the handle_new_user function to support company data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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
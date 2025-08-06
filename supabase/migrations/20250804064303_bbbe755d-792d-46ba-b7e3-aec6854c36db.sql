-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.set_prospect_date_added()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.date_added IS NULL THEN
    NEW.date_added := NEW.created_at;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_days_in_followup(
  date_added_param TIMESTAMP WITH TIME ZONE,
  follow_ups_param JSONB
) RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;
-- Add follow-up tracking to prospects table
ALTER TABLE public.prospects 
ADD COLUMN date_added TIMESTAMP WITH TIME ZONE,
ADD COLUMN first_contact_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN follow_ups JSONB DEFAULT '[]'::jsonb;

-- Update existing records to have date_added equal to created_at
UPDATE public.prospects 
SET date_added = created_at 
WHERE date_added IS NULL;

-- Set default for new records going forward using a trigger
CREATE OR REPLACE FUNCTION public.set_prospect_date_added()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.date_added IS NULL THEN
    NEW.date_added := NEW.created_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_prospect_date_added_trigger
  BEFORE INSERT ON public.prospects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_prospect_date_added();

-- Create function to calculate days in follow-up
CREATE OR REPLACE FUNCTION public.calculate_days_in_followup(
  date_added_param TIMESTAMP WITH TIME ZONE,
  follow_ups_param JSONB
) RETURNS INTEGER AS $$
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
$$ LANGUAGE plpgsql;
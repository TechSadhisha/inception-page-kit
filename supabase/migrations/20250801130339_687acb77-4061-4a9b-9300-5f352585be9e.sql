-- Add additional fields to prospects table for Lead Centre functionality
ALTER TABLE public.prospects 
ADD COLUMN source TEXT DEFAULT 'manual',
ADD COLUMN lead_score INTEGER CHECK (lead_score >= 0 AND lead_score <= 100),
ADD COLUMN last_contacted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN conversion_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN tags TEXT[];

-- Add index for source field for better query performance
CREATE INDEX idx_prospects_source ON public.prospects(source);

-- Add index for lead_score for analytics queries
CREATE INDEX idx_prospects_lead_score ON public.prospects(lead_score);

-- Update the updated_at trigger to work with new fields
CREATE OR REPLACE FUNCTION public.update_prospect_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_prospects_updated_at ON public.prospects;
CREATE TRIGGER update_prospects_updated_at
    BEFORE UPDATE ON public.prospects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_prospect_updated_at();
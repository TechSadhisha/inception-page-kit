-- Current facebook_integrations table has most required columns but needs schema adjustments
-- The table currently uses 'id' as primary key (uuid) and 'user_id' as uuid
-- User wants 'user_id' as text PRIMARY KEY

-- Drop the existing table and recreate with the desired schema
DROP TABLE IF EXISTS facebook_integrations CASCADE;

CREATE TABLE facebook_integrations (
  user_id text PRIMARY KEY,
  facebook_user_id text NOT NULL,
  access_token text NOT NULL,
  token_expires_at timestamptz,
  ad_account_id text,
  ad_account_name text,
  permissions text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- Additional useful columns from the original table
  page_access_token text,
  refresh_token text,
  business_id text,
  selected_page_id text,
  selected_page_name text
);

-- Enable RLS
ALTER TABLE facebook_integrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own Facebook integrations" 
ON facebook_integrations 
FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own Facebook integrations" 
ON facebook_integrations 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own Facebook integrations" 
ON facebook_integrations 
FOR UPDATE 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own Facebook integrations" 
ON facebook_integrations 
FOR DELETE 
USING (auth.uid()::text = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_facebook_integrations_updated_at
BEFORE UPDATE ON facebook_integrations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
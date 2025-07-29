-- Add page selection fields to facebook_integrations table
ALTER TABLE facebook_integrations 
ADD COLUMN selected_page_id text,
ADD COLUMN selected_page_name text,
ADD COLUMN page_access_token text;
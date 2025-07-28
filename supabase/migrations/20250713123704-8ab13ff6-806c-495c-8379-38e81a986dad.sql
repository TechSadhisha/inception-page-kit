
-- Create table for storing email messages
CREATE TABLE public.emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  gmail_message_id TEXT NOT NULL,
  thread_id TEXT,
  subject TEXT,
  sender TEXT,
  recipient TEXT,
  body_text TEXT,
  body_html TEXT,
  received_date TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT false,
  labels TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing Gmail sync status
CREATE TABLE public.gmail_sync_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_token TEXT,
  is_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for emails table
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own emails" 
  ON public.emails 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emails" 
  ON public.emails 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emails" 
  ON public.emails 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emails" 
  ON public.emails 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for gmail_sync_status table
ALTER TABLE public.gmail_sync_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sync status" 
  ON public.gmail_sync_status 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sync status" 
  ON public.gmail_sync_status 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_emails_user_id ON public.emails(user_id);
CREATE INDEX idx_emails_received_date ON public.emails(received_date DESC);
CREATE INDEX idx_emails_is_read ON public.emails(is_read);
CREATE INDEX idx_gmail_sync_user_id ON public.gmail_sync_status(user_id);

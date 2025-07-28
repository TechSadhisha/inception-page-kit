
-- Create knowledge_videos table for storing YouTube training video references
CREATE TABLE public.knowledge_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.knowledge_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for knowledge_videos
CREATE POLICY "Users can view all knowledge videos" 
  ON public.knowledge_videos 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create knowledge videos" 
  ON public.knowledge_videos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge videos" 
  ON public.knowledge_videos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own knowledge videos" 
  ON public.knowledge_videos 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better search performance
CREATE INDEX idx_knowledge_videos_category ON public.knowledge_videos(category);
CREATE INDEX idx_knowledge_videos_tags ON public.knowledge_videos USING GIN(tags);
CREATE INDEX idx_knowledge_videos_user_id ON public.knowledge_videos(user_id);

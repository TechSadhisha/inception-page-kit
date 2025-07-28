
-- Create a table for storing scripts
CREATE TABLE public.scripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('presentation', 'video', 'audio', 'document')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see scripts they have access to
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view scripts for projects they have access to
CREATE POLICY "Users can view scripts for accessible projects" 
  ON public.scripts 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = scripts.project_id 
      AND (p.created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.project_assignments pa
        WHERE pa.project_id = p.id AND pa.user_id = auth.uid()
      ))
    )
  );

-- Create policy that allows users to insert scripts for projects they have access to
CREATE POLICY "Users can create scripts for accessible projects" 
  ON public.scripts 
  FOR INSERT 
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = scripts.project_id 
      AND (p.created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.project_assignments pa
        WHERE pa.project_id = p.id AND pa.user_id = auth.uid()
      ))
    )
  );

-- Create policy that allows users to update their own scripts
CREATE POLICY "Users can update their own scripts" 
  ON public.scripts 
  FOR UPDATE 
  USING (created_by = auth.uid());

-- Create policy that allows users to delete their own scripts
CREATE POLICY "Users can delete their own scripts" 
  ON public.scripts 
  FOR DELETE 
  USING (created_by = auth.uid());

-- Create an index for better performance
CREATE INDEX idx_scripts_project_id ON public.scripts(project_id);
CREATE INDEX idx_scripts_created_by ON public.scripts(created_by);

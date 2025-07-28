
-- Create whatsapp_messages table
CREATE TABLE public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_id UUID NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE NULL,
  delivered_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_by UUID NOT NULL REFERENCES public.profiles(id)
);

-- Enable Row Level Security
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view whatsapp messages for accessible prospects" 
  ON public.whatsapp_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.prospects p
      WHERE p.id = whatsapp_messages.prospect_id
      AND (
        p.assigned_to = auth.uid() OR 
        has_role(auth.uid(), 'admin'::app_role) OR 
        has_role(auth.uid(), 'manager'::app_role) OR
        EXISTS (
          SELECT 1 FROM public.projects pr
          WHERE pr.id = p.project_id 
          AND (
            pr.created_by = auth.uid() OR
            EXISTS (
              SELECT 1 FROM public.project_assignments pa
              WHERE pa.project_id = pr.id AND pa.user_id = auth.uid()
            )
          )
        )
      )
    )
  );

CREATE POLICY "Users can create whatsapp messages for accessible prospects" 
  ON public.whatsapp_messages 
  FOR INSERT 
  WITH CHECK (
    sent_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.prospects p
      WHERE p.id = whatsapp_messages.prospect_id
      AND (
        p.assigned_to = auth.uid() OR 
        has_role(auth.uid(), 'admin'::app_role) OR 
        has_role(auth.uid(), 'manager'::app_role) OR
        EXISTS (
          SELECT 1 FROM public.projects pr
          WHERE pr.id = p.project_id 
          AND (
            pr.created_by = auth.uid() OR
            EXISTS (
              SELECT 1 FROM public.project_assignments pa
              WHERE pa.project_id = pr.id AND pa.user_id = auth.uid()
            )
          )
        )
      )
    )
  );

CREATE POLICY "Users can update whatsapp messages they sent" 
  ON public.whatsapp_messages 
  FOR UPDATE 
  USING (sent_by = auth.uid());

CREATE POLICY "Admins and managers can delete whatsapp messages" 
  ON public.whatsapp_messages 
  FOR DELETE 
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'manager'::app_role)
  );

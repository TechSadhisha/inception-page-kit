
-- Create an enum for role types
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'staff');

-- Create user_roles table to assign roles to users
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create a function to get user's highest role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'manager' THEN 2
      WHEN 'staff' THEN 3
    END
  LIMIT 1
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles" 
  ON public.user_roles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view team roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'manager'));

-- Update existing tables to respect role-based permissions
-- Update projects table policies
DROP POLICY IF EXISTS "Allow all authenticated users full access" ON public.projects;

CREATE POLICY "Users can view accessible projects" 
  ON public.projects 
  FOR SELECT 
  USING (
    created_by = auth.uid() OR 
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'manager') OR
    EXISTS (
      SELECT 1 FROM public.project_assignments 
      WHERE project_id = projects.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can create projects" 
  ON public.projects 
  FOR INSERT 
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'manager')
  );

CREATE POLICY "Project creators and admins can update projects" 
  ON public.projects 
  FOR UPDATE 
  USING (
    created_by = auth.uid() OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete projects" 
  ON public.projects 
  FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Update prospects table policies
DROP POLICY IF EXISTS "Allow all authenticated users full access" ON public.prospects;

CREATE POLICY "Users can view accessible prospects" 
  ON public.prospects 
  FOR SELECT 
  USING (
    assigned_to = auth.uid() OR 
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'manager') OR
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = prospects.project_id AND (
        p.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.project_assignments pa 
          WHERE pa.project_id = p.id AND pa.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Managers and admins can create prospects" 
  ON public.prospects 
  FOR INSERT 
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'manager')
  );

CREATE POLICY "Assigned users and managers can update prospects" 
  ON public.prospects 
  FOR UPDATE 
  USING (
    assigned_to = auth.uid() OR 
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'manager')
  );

CREATE POLICY "Admins and managers can delete prospects" 
  ON public.prospects 
  FOR DELETE 
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'manager')
  );

-- Update tasks table policies
DROP POLICY IF EXISTS "Allow all authenticated users full access" ON public.tasks;

CREATE POLICY "Users can view accessible tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (
    assigned_to = auth.uid() OR 
    created_by = auth.uid() OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'manager') OR
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = tasks.project_id AND (
        p.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.project_assignments pa 
          WHERE pa.project_id = p.id AND pa.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Assigned users, creators, and managers can update tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (
    assigned_to = auth.uid() OR 
    created_by = auth.uid() OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'manager')
  );

CREATE POLICY "Creators, admins and managers can delete tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (
    created_by = auth.uid() OR
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'manager')
  );

-- Insert default admin role for existing users (optional - you may want to do this manually)
-- This gives the first user admin privileges
INSERT INTO public.user_roles (user_id, role, assigned_by)
SELECT id, 'admin', id
FROM auth.users
WHERE email IS NOT NULL
ORDER BY created_at
LIMIT 1
ON CONFLICT (user_id, role) DO NOTHING;

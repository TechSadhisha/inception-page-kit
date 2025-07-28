
-- Drop existing RLS policies on all tables
DROP POLICY IF EXISTS "messages_insert_policy" ON public.messages;
DROP POLICY IF EXISTS "messages_select_policy" ON public.messages;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "Project owners manage assignments" ON public.project_assignments;
DROP POLICY IF EXISTS "View own assignments only" ON public.project_assignments;
DROP POLICY IF EXISTS "project_assignments_delete_policy" ON public.project_assignments;
DROP POLICY IF EXISTS "project_assignments_insert_policy" ON public.project_assignments;
DROP POLICY IF EXISTS "project_assignments_select_policy" ON public.project_assignments;
DROP POLICY IF EXISTS "project_assignments_update_policy" ON public.project_assignments;
DROP POLICY IF EXISTS "project_sheets_delete_policy" ON public.project_sheets;
DROP POLICY IF EXISTS "project_sheets_insert_policy" ON public.project_sheets;
DROP POLICY IF EXISTS "project_sheets_select_policy" ON public.project_sheets;
DROP POLICY IF EXISTS "project_sheets_update_policy" ON public.project_sheets;
DROP POLICY IF EXISTS "projects_insert_policy" ON public.projects;
DROP POLICY IF EXISTS "projects_select_policy" ON public.projects;
DROP POLICY IF EXISTS "projects_update_policy" ON public.projects;
DROP POLICY IF EXISTS "Manage prospects from owned projects" ON public.prospects;
DROP POLICY IF EXISTS "View prospects from owned projects" ON public.prospects;
DROP POLICY IF EXISTS "prospects_delete_policy" ON public.prospects;
DROP POLICY IF EXISTS "prospects_insert_policy" ON public.prospects;
DROP POLICY IF EXISTS "prospects_select_policy" ON public.prospects;
DROP POLICY IF EXISTS "prospects_update_policy" ON public.prospects;
DROP POLICY IF EXISTS "reports_delete_policy" ON public.reports;
DROP POLICY IF EXISTS "reports_insert_policy" ON public.reports;
DROP POLICY IF EXISTS "reports_select_policy" ON public.reports;
DROP POLICY IF EXISTS "reports_update_policy" ON public.reports;
DROP POLICY IF EXISTS "site_media_delete_policy" ON public.site_media;
DROP POLICY IF EXISTS "site_media_insert_policy" ON public.site_media;
DROP POLICY IF EXISTS "site_media_select_policy" ON public.site_media;
DROP POLICY IF EXISTS "site_media_update_policy" ON public.site_media;
DROP POLICY IF EXISTS "tasks_delete_policy" ON public.tasks;
DROP POLICY IF EXISTS "tasks_insert_policy" ON public.tasks;
DROP POLICY IF EXISTS "tasks_select_policy" ON public.tasks;
DROP POLICY IF EXISTS "tasks_update_policy" ON public.tasks;
DROP POLICY IF EXISTS "transcripts_delete_policy" ON public.transcripts;
DROP POLICY IF EXISTS "transcripts_insert_policy" ON public.transcripts;
DROP POLICY IF EXISTS "transcripts_select_policy" ON public.transcripts;
DROP POLICY IF EXISTS "transcripts_update_policy" ON public.transcripts;

-- Disable RLS on all tables
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_sheets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_media DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcripts DISABLE ROW LEVEL SECURITY;

-- Create simple policies that allow all authenticated users to access everything
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users full access" ON public.messages FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users full access" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users full access" ON public.project_assignments FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.project_sheets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users full access" ON public.project_sheets FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users full access" ON public.projects FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users full access" ON public.prospects FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users full access" ON public.reports FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users full access" ON public.site_media FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users full access" ON public.tasks FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users full access" ON public.transcripts FOR ALL USING (auth.role() = 'authenticated');

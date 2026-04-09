-- Create the 'projects' table for Code Galaxy
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    description TEXT,
    size FLOAT DEFAULT 1.0,
    commits INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create a table for language distribution per project
CREATE TABLE IF NOT EXISTS public.project_languages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    color TEXT NOT NULL,
    percentage FLOAT NOT NULL,
    UNIQUE(project_id, language)
);

-- Function to update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_modtime
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Set up Row Level Security (RLS)
-- Allow public read access to projects and languages so the Cloudflare Worker/Frontend can read it anonymously
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on projects" 
ON public.projects FOR SELECT USING (true);

CREATE POLICY "Allow public read access on project_languages" 
ON public.project_languages FOR SELECT USING (true);

-- Create a secure service role policy for the n8n automation / GitHub Actions to insert/update
-- (This assumes the automation uses the Supabase Service Role Key)
CREATE POLICY "Allow service role to manage projects" 
ON public.projects USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role to manage project_languages" 
ON public.project_languages USING (auth.role() = 'service_role');

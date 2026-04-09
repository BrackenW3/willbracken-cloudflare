import { createClient } from '@supabase/supabase-js';

// We use import.meta.env for Vite environment variables in the frontend
// Do NOT hardcode these. They will be passed in via Cloudflare Pages CI/CD.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

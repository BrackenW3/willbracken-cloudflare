import { createClient } from '@supabase/supabase-js';

// Define the environment bindings for the worker
export interface Env {
  DB_ANALYTICS: D2Database;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 2. Logging/Analytics into Cloudflare D2
    if (url.pathname === '/api/log') {
      try {
        const body = await request.json() as { event: string; path: string };
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const userAgent = request.headers.get('User-Agent') || 'unknown';
        
        // Ensure table exists (in production, you'd run this via migrations)
        await env.DB_ANALYTICS.prepare(
          `CREATE TABLE IF NOT EXISTS page_views (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            event TEXT, 
            path TEXT, 
            ip TEXT, 
            user_agent TEXT, 
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
          )`
        ).run();

        // Insert log
        await env.DB_ANALYTICS.prepare(
          `INSERT INTO page_views (event, path, ip, user_agent) VALUES (?, ?, ?, ?)`
        ).bind(body.event, body.path, ip, userAgent).run();

        return new Response(JSON.stringify({ success: true }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    // 3. Supabase Integration Example
    if (url.pathname === '/api/projects') {
      try {
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
          auth: { persistSession: false }
        });

        // Pull top projects for the Code Galaxy from Supabase Postgres
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('commits', { ascending: false })
          .limit(100);

        if (error) throw error;

        return new Response(JSON.stringify({ projects: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers: corsHeaders });
  },
};

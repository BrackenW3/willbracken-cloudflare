import { createClient } from '@supabase/supabase-js';

export interface Env {
  DB_ANALYTICS: D2Database;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  NEO4J_WEBHOOK_URL?: string; // Optional: Forward data to Neo4j via n8n or direct API
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log(`Cron triggered at ${event.cron}`);
    
    // Periodically we can aggregate D2 logs and batch insert them into Neo4j
    // This is better than hitting Neo4j per-request to keep the Edge fast
    if (env.NEO4J_WEBHOOK_URL) {
      try {
        const result = await env.DB_ANALYTICS.prepare(`SELECT * FROM page_views WHERE synced_to_graph = 0 LIMIT 100`).all();
        if (result.results && result.results.length > 0) {
          // Push to Neo4j ingestion pipeline (e.g. n8n webhook)
          const resp = await fetch(env.NEO4J_WEBHOOK_URL, {
            method: 'POST',
            body: JSON.stringify({ batch: result.results }),
            headers: { 'Content-Type': 'application/json' }
          });
          if (resp.ok) {
            // Mark as synced
            const ids = result.results.map(r => r.id).join(',');
            await env.DB_ANALYTICS.prepare(`UPDATE page_views SET synced_to_graph = 1 WHERE id IN (${ids})`).run();
          }
        }
      } catch (err) {
        console.error("Failed to sync analytics to graph database:", err);
      }
    }
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. ROBUST ANALYTICS ENGINE (D2 + Cloudflare Metadata)
    if (url.pathname === '/api/log') {
      try {
        const body = await request.json() as any;
        
        // Cloudflare injects amazing geographic/network metadata into headers
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const country = request.headers.get('CF-IPCountry') || 'unknown';
        const city = request.headers.get('CF-IPCity') || 'unknown';
        const asOrganization = request.headers.get('CF-IPASNO') || 'unknown'; // ISP or Org
        const userAgent = request.headers.get('User-Agent') || 'unknown';
        const referrer = request.headers.get('Referer') || body.referrer || 'direct';
        const sessionId = body.sessionId || 'anonymous';
        const duration = body.duration || 0;
        
        // Ensure robust analytics table schema
        await env.DB_ANALYTICS.prepare(
          `CREATE TABLE IF NOT EXISTS page_views (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            session_id TEXT,
            event TEXT, 
            path TEXT, 
            ip TEXT, 
            country TEXT,
            city TEXT,
            asn_org TEXT,
            user_agent TEXT, 
            referrer TEXT,
            duration_ms INTEGER,
            metadata TEXT,
            synced_to_graph INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
          )`
        ).run();

        // Insert robust log
        await env.DB_ANALYTICS.prepare(
          `INSERT INTO page_views 
          (session_id, event, path, ip, country, city, asn_org, user_agent, referrer, duration_ms, metadata) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          sessionId, 
          body.event || 'pageview', 
          body.path || url.pathname, 
          ip, 
          country, 
          city,
          asOrganization,
          userAgent, 
          referrer, 
          duration,
          JSON.stringify(body.metadata || {})
        ).run();

        return new Response(JSON.stringify({ success: true }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    // 2. Supabase Data Passthrough
    if (url.pathname === '/api/projects') {
      try {
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
          auth: { persistSession: false }
        });

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
import { createClient } from '@supabase/supabase-js';

// This script is designed to be run via GitHub Actions on a schedule (e.g., daily)
// or triggered by a webhook from n8n.
// It fetches the latest repository stats from GitHub and updates Supabase.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Requires Service Role key to bypass RLS for inserts
const githubToken = process.env.GITHUB_TOKEN;

if (!supabaseUrl || !supabaseServiceKey || !githubToken) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncRepositories() {
  console.log("Starting GitHub to Supabase sync...");
  
  try {
    // 1. Fetch repositories from GitHub API (simplified example)
    const response = await fetch('https://api.github.com/users/brackenw3/repos?per_page=100', {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) throw new Error(`GitHub API error: ${response.statusText}`);
    const repos = await response.json();

    for (const repo of repos) {
      // 2. Fetch language data for each repo
      const langResponse = await fetch(repo.languages_url, {
        headers: { 'Authorization': `token ${githubToken}` }
      });
      const langs = await langResponse.json();
      
      // Calculate percentages
      const totalBytes = Object.values(langs).reduce((a: unknown, b: unknown) => (a as number) + (b as number), 0) as number;
      
      // Calculate visual size based on size + forks + stars
      const visualSize = Math.max(0.8, Math.min(2.5, 0.5 + Math.log10(repo.size || 10) * 0.2));

      // 3. Upsert Project into Supabase
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .upsert({
          name: repo.name,
          url: repo.html_url,
          description: repo.description,
          size: visualSize,
          commits: repo.size, // Approximation for now, you'd fetch /commits for exact count
        }, { onConflict: 'name' })
        .select()
        .single();

      if (projectError) {
        console.error(`Error upserting ${repo.name}:`, projectError);
        continue;
      }

      // 4. Upsert Languages
      for (const [language, bytes] of Object.entries(langs)) {
        const percentage = (bytes as number) / totalBytes;
        // Map common languages to Cyberpunk colors
        let color = '#3b82f6'; // Default Cyber Blue
        if (language === 'Python') color = '#10b981';
        if (language === 'Rust') color = '#ff6b00';
        if (language === 'Go') color = '#06b6d4';
        if (language === 'TypeScript' || language === 'JavaScript') color = '#eab308';
        if (language === 'HTML' || language === 'CSS') color = '#a855f7';

        await supabase
          .from('project_languages')
          .upsert({
            project_id: project.id,
            language: language,
            percentage: percentage,
            color: color
          }, { onConflict: 'project_id, language' });
      }
      
      console.log(`Synced: ${repo.name}`);
    }

    console.log("Sync complete!");
  } catch (error) {
    console.error("Sync failed:", error);
    process.exit(1);
  }
}

syncRepositories();
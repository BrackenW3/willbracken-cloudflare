import { Database } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TIMELINE_DATA = [
  { month: 'Jan', commits: 150, volume: 1200 },
  { month: 'Feb', commits: 230, volume: 1500 },
  { month: 'Mar', commits: 400, volume: 2900 },
  { month: 'Apr', commits: 320, volume: 2500 },
  { month: 'May', commits: 500, volume: 4800 },
  { month: 'Jun', commits: 450, volume: 4200 },
  { month: 'Jul', commits: 600, volume: 5500 },
  { month: 'Aug', commits: 750, volume: 6800 },
  { month: 'Sep', commits: 800, volume: 7200 },
  { month: 'Oct', commits: 1100, volume: 9500 },
  { month: 'Nov', commits: 1400, volume: 12000 },
  { month: 'Dec', commits: 1800, volume: 14500 },
];

const LANG_VOLUME_DATA = [
  { name: 'TypeScript', value: 65, color: '#3b82f6' },
  { name: 'Python', value: 25, color: '#10b981' },
  { name: 'Rust', value: 15, color: '#ff6b00' },
  { name: 'Go', value: 5, color: '#06b6d4' },
];

const LEGEND = [
  { label: 'TypeScript', color: '#3b82f6' },
  { label: 'Python', color: '#10b981' },
  { label: 'Rust', color: '#ff6b00' },
  { label: 'Go', color: '#06b6d4' },
];

export function Overlay() {
  const [statusLogs, setStatusLogs] = useState<string[]>(['INITIALIZING_GALAXY_OS...', 'LOADING_REPOSITORIES...']);

  useEffect(() => {
    const logs = [
      'SCANNING_VSCODE_MONOREPO...',
      'ESTABLISHING_RTX4080_TUNNEL...',
      'SYNCING_SUPABASE_POSTGRES...',
      'NEO4J_GRAPH_ONLINE',
      'D2_ANALYTICS_CAPTURE_ACTIVE',
      'CLOUDFLARE_EDGE_HEALTH_100%',
      'QUERYING_GITHUB_API...',
    ];
    let i = 0;
    const interval = setInterval(() => {
      setStatusLogs(prev => [...prev.slice(-4), logs[i % logs.length]]);
      i++;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-10 pointer-events-none p-6 flex flex-col justify-between">
      {/* Top Left: Terminal Status */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <div className="flex flex-col gap-1">
          {statusLogs.map((log, idx) => (
            <motion.div 
              key={`${log}-${idx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.6, x: 0 }}
              className="text-[9px] font-mono text-cyber-blue-400 tracking-tighter"
            >
              <span className="text-cyber-orange mr-2">&gt;&gt;</span> {log}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 justify-between items-end pb-2 pt-4">
        {/* Left Side: Stats and Volume Chart */}
        <div className="flex flex-col gap-4 pointer-events-auto w-[350px]">
          <div className="border border-cyber-blue-500/30 bg-cyber-blue-900/60 backdrop-blur-xl p-5 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Database size={20} className="text-cyber-blue-400" />
              The Code Galaxy
            </h2>
            <p className="text-slate-300 leading-relaxed text-xs mb-4">
              An interactive visualization of the VSCode_Folders monorepo and related 
              architectures. Scroll to zoom, drag to rotate.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-cyber-blue-800/50 p-3 rounded-xl border border-cyber-blue-500/20">
                <div className="text-cyber-blue-400 text-[10px] font-mono mb-1">TOTAL COMMITS</div>
                <div className="text-xl font-bold text-white text-glow-blue">24,892</div>
              </div>
              <div className="bg-cyber-blue-800/50 p-3 rounded-xl border border-cyber-orange/20">
                <div className="text-cyber-orange text-[10px] font-mono mb-1">ACTIVE NODES</div>
                <div className="text-xl font-bold text-white text-glow-orange">142</div>
              </div>
            </div>
          </div>

          {/* Volume Chart */}
          <div className="border border-cyber-blue-500/30 bg-cyber-blue-900/60 backdrop-blur-xl p-4 rounded-2xl shadow-2xl">
            <h3 className="text-xs font-bold text-white mb-3 font-mono tracking-wider">CODE VOLUME BY LANGUAGE</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={LANG_VOLUME_DATA} layout="vertical" margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(59, 130, 246, 0.1)'}} 
                    contentStyle={{ backgroundColor: '#0a0f1c', border: '1px solid #1f3b73', borderRadius: '8px', color: '#fff', fontSize: '12px' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                    {
                      LANG_VOLUME_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Center: Timeline */}
        <div className="flex-1 px-6 pointer-events-auto h-[180px]">
          <div className="border border-cyber-blue-500/30 bg-cyber-blue-900/60 backdrop-blur-xl p-4 rounded-2xl shadow-2xl h-full flex flex-col relative">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-white font-mono tracking-wider">ACTIVITY TIMELINE (1YR)</h3>
              <div className="flex gap-4 text-[10px] font-mono">
                <span className="text-cyber-orange flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyber-orange"></div> COMMITS</span>
                <span className="text-cyber-blue-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyber-blue-400"></div> VOLUME (LOC)</span>
              </div>
            </div>
            
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TIMELINE_DATA} margin={{ top: 5, right: 0, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ff6b00" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#ff6b00" fontSize={10} axisLine={false} tickLine={false} width={35} />
                  <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={10} axisLine={false} tickLine={false} width={45} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0f1c', border: '1px solid #1f3b73', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="commits" stroke="#ff6b00" strokeWidth={2} fillOpacity={1} fill="url(#colorCommits)" />
                  <Area yAxisId="right" type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Right: Legend */}
        <div className="pointer-events-auto w-[160px]">
          <div className="border border-cyber-blue-500/30 bg-cyber-blue-900/60 backdrop-blur-xl p-4 rounded-2xl shadow-2xl">
            <h3 className="text-[10px] font-bold text-cyber-blue-400 mb-3 font-mono tracking-widest uppercase">Language Nodes</h3>
            <div className="flex flex-col gap-2.5">
              {LEGEND.map(l => (
                <div key={l.label} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color, boxShadow: `0 0 10px ${l.color}` }}></div>
                  <span className="text-xs text-slate-200 font-mono tracking-wide">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
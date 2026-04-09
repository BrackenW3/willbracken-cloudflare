import { useState, useRef } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { motion } from 'framer-motion';
import { ShieldAlert, Network, Activity } from 'lucide-react';

// Mock Neo4j Output Data representing Visitors -> Pages -> Countries
const MOCK_GRAPH_DATA = {
  nodes: [
    { id: 'US', group: 1, name: 'United States', val: 20 },
    { id: 'UK', group: 1, name: 'United Kingdom', val: 15 },
    { id: 'Session-A', group: 2, name: 'Visitor 192.168.x.x', val: 5 },
    { id: 'Session-B', group: 2, name: 'Visitor 10.0.x.x', val: 5 },
    { id: 'Session-C', group: 2, name: 'Visitor 172.16.x.x', val: 5 },
    { id: '/project/ai-vision', group: 3, name: 'AI Vision Page', val: 10 },
    { id: '/project/ms-teams-export', group: 3, name: 'Teams Export Page', val: 10 },
    { id: '/', group: 3, name: 'Code Galaxy Home', val: 15 },
  ],
  links: [
    { source: 'Session-A', target: 'US', label: 'LOCATED_IN' },
    { source: 'Session-B', target: 'US', label: 'LOCATED_IN' },
    { source: 'Session-C', target: 'UK', label: 'LOCATED_IN' },
    { source: 'Session-A', target: '/', label: 'VISITED' },
    { source: 'Session-A', target: '/project/ai-vision', label: 'VISITED' },
    { source: 'Session-B', target: '/project/ms-teams-export', label: 'VISITED' },
    { source: 'Session-C', target: '/', label: 'VISITED' },
  ]
};

export function InternalAnalytics() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const fgRef = useRef<any>(null);

  // In a real app, this would be tied to Supabase Auth or Cloudflare Access
  if (!isAuthenticated) {
    return (
      <div className="w-full h-full pt-32 px-8 flex items-center justify-center">
        <div className="border border-red-500/30 bg-red-900/20 backdrop-blur-xl p-8 rounded-2xl flex flex-col items-center gap-4">
          <ShieldAlert size={48} className="text-red-500" />
          <h2 className="text-xl font-bold text-white font-mono tracking-widest">INTERNAL_ACCESS_REQUIRED</h2>
          <p className="text-sm text-slate-300">Authentication via Cloudflare Access is required to view Neo4j graph analytics.</p>
          <button 
            onClick={() => setIsAuthenticated(true)}
            className="mt-4 px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/40 transition-colors font-mono"
          >
            [ SIMULATE AUTH LOGIN ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full pt-24 px-6 pb-6 flex flex-col gap-6"
    >
      <header className="flex justify-between items-center bg-cyber-blue-900/60 border border-cyber-blue-500/30 p-4 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Network className="text-cyber-blue-400" size={24} />
          <h1 className="text-xl font-bold text-white font-mono">Neo4j + GDS Graph Intelligence</h1>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
          <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Cloudflare D2 Syncing</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> GDS Engine Online</span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        
        {/* Left Panel: Analytics Insights */}
        <div className="col-span-1 border border-cyber-blue-500/30 bg-cyber-blue-900/60 rounded-xl p-6 overflow-y-auto backdrop-blur-md flex flex-col gap-6">
          <h3 className="text-sm font-bold text-cyber-blue-400 font-mono border-b border-cyber-blue-500/30 pb-2">GDS_INSIGHTS</h3>
          
          <div className="bg-cyber-blue-800/30 p-4 rounded-lg border border-cyber-blue-500/20">
            <h4 className="text-xs text-slate-400 mb-1">PageRank Centrality</h4>
            <p className="text-sm text-white">Highest Authority Node: <span className="text-cyber-orange">Code Galaxy Home (0.42)</span></p>
          </div>

          <div className="bg-cyber-blue-800/30 p-4 rounded-lg border border-cyber-blue-500/20">
            <h4 className="text-xs text-slate-400 mb-1">Louvain Community Detection</h4>
            <p className="text-sm text-white">Identified <span className="text-cyber-blue-400 font-bold">3 distinct user cohorts</span> originating from North America interacting primarily with AI Vision.</p>
          </div>

          <div className="mt-auto">
            <h4 className="text-[10px] font-mono text-slate-500 mb-2">GRAPH_LEGEND</h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li className="flex items-center gap-2"><div className="w-3 h-3 bg-[#ff6b00] rounded-full"></div> Location Nodes</li>
              <li className="flex items-center gap-2"><div className="w-3 h-3 bg-[#3b82f6] rounded-full"></div> Visitor Sessions</li>
              <li className="flex items-center gap-2"><div className="w-3 h-3 bg-[#10b981] rounded-full"></div> Page Nodes</li>
            </ul>
          </div>
        </div>

        {/* Right Panel: Force Graph 3D */}
        <div className="col-span-3 border border-cyber-blue-500/30 bg-[#0a0f1c] rounded-xl overflow-hidden relative shadow-[inset_0_0_50px_rgba(59,130,246,0.1)]">
          <ForceGraph3D
            ref={fgRef}
            graphData={MOCK_GRAPH_DATA}
            nodeLabel="name"
            nodeColor={(node: any) => {
              if (node.group === 1) return '#ff6b00'; // Country
              if (node.group === 2) return '#3b82f6'; // Session
              return '#10b981'; // Page
            }}
            nodeVal="val"
            linkColor={() => 'rgba(59, 130, 246, 0.4)'}
            linkWidth={1}
            backgroundColor="#0a0f1c"
            onNodeClick={(node: any) => {
              // Aim at node from outside it
              const distance = 40;
              const distRatio = 1 + distance/Math.hypot(node.x!, node.y!, node.z!);
              fgRef.current.cameraPosition(
                { x: node.x! * distRatio, y: node.y! * distRatio, z: node.z! * distRatio }, 
                node, 
                3000 
              );
            }}
          />
          <div className="absolute bottom-4 right-4 bg-cyber-blue-900/80 px-4 py-2 rounded-lg border border-cyber-blue-500/30 text-[10px] font-mono flex items-center gap-2">
            <Activity size={12} className="text-cyber-blue-400" /> Left-click: Rotate | Right-click: Pan | Scroll: Zoom
          </div>
        </div>
      </div>

    </motion.div>
  );
}

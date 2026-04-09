import { Globe, Terminal, Database, Code2 } from 'lucide-react';

export function Overlay() {
  return (
    <div className="absolute inset-0 w-full h-full z-10 pointer-events-none p-8 flex flex-col justify-between">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div className="pointer-events-auto">
          <h1 className="text-4xl font-bold tracking-tighter text-glow-blue mb-2">
            WILL_BRACKEN
          </h1>
          <p className="text-cyber-blue-400 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
            <Terminal size={16} />
            System Architect & Elite Engineer
          </p>
        </div>
        
        <nav className="flex gap-4 pointer-events-auto">
          <button className="p-3 rounded-xl border border-cyber-blue-500/30 bg-cyber-blue-900/50 backdrop-blur-md hover:bg-cyber-blue-800/80 hover:border-cyber-blue-400 transition-all text-cyber-blue-400 hover:text-glow-blue box-glow-blue">
            <Globe size={20} />
          </button>
          <button className="p-3 rounded-xl border border-cyber-orange/30 bg-cyber-blue-900/50 backdrop-blur-md hover:bg-cyber-orange/20 hover:border-cyber-orange transition-all text-cyber-orange hover:text-glow-orange box-glow-orange">
            <Code2 size={20} />
          </button>
        </nav>
      </header>

      {/* Main Content Info Overlay */}
      <div className="max-w-md pointer-events-auto">
        <div className="border border-cyber-blue-500/30 bg-cyber-blue-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Database size={24} className="text-cyber-blue-400" />
            The Code Galaxy
          </h2>
          <p className="text-slate-300 leading-relaxed text-sm mb-6">
            An interactive visualization of the VSCode_Folders monorepo and related 
            architectures. Each node represents a distinct project cluster, scaled 
            by impact and commit volume.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cyber-blue-800/50 p-4 rounded-xl border border-cyber-blue-500/20">
              <div className="text-cyber-blue-400 text-xs font-mono mb-1">TOTAL COMMITS</div>
              <div className="text-2xl font-bold text-white text-glow-blue">24,892</div>
            </div>
            <div className="bg-cyber-blue-800/50 p-4 rounded-xl border border-cyber-orange/20">
              <div className="text-cyber-orange text-xs font-mono mb-1">ACTIVE NODES</div>
              <div className="text-2xl font-bold text-white text-glow-orange">142</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

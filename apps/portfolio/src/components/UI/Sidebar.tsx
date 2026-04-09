import { Link, useLocation } from 'react-router-dom';
import { Home, Code2, Terminal, Cpu, Database, Network, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export function Sidebar() {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/github', label: 'Code Galaxy', icon: Code2 },
    { path: '/project/ms-teams-export', label: 'Teams Export', icon: Terminal },
    { path: '/project/snowflake-streamlit', label: 'Snowflake AI', icon: Database },
    { path: '/project/ai-vision', label: 'AI Vision', icon: Cpu },
    { path: '/internal-analytics', label: 'Analytics', icon: Network },
  ];

  return (
    <aside className="w-64 h-full bg-[#0d1117] border-r border-slate-800 flex flex-col z-50 overflow-hidden text-slate-400">
      <div className="p-6 mb-4">
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 bg-cyber-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_#3b82f6]">
            W
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold tracking-tighter text-lg leading-none">BRACKEN</span>
            <span className="text-cyber-blue-400 font-mono text-[10px] tracking-[0.2em] mt-1">SYSTEMS_OS</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 no-underline ${
                isActive 
                  ? 'bg-slate-800 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-cyber-blue-400' : 'text-slate-500 group-hover:text-slate-300'} />
              <span className="font-medium text-sm tracking-tight">{link.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="ml-auto w-1 h-4 bg-cyber-blue-400 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800 bg-slate-900/30">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">System Online</span>
          </div>
          <a href="https://github.com/brackenw3" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </aside>
  );
}

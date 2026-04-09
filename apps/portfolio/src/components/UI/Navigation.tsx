import { Link, useLocation } from 'react-router-dom';
import { Home, Terminal, Cpu, Database, Network } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navigation() {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Galaxy', icon: Home },
    { path: '/project/ms-teams-export', label: 'Teams Export', icon: Terminal },
    { path: '/project/snowflake-streamlit', label: 'Snowflake AI', icon: Database },
    { path: '/project/ai-vision', label: 'AI Vision', icon: Cpu },
    { path: '/internal-analytics', label: 'Internal DB', icon: Network },
  ];

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div className="flex items-center gap-2 p-2 rounded-2xl border border-cyber-blue-500/30 bg-cyber-blue-900/80 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.15)]">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.path}
              to={link.path}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono tracking-wide transition-all duration-300 ${
                isActive 
                  ? 'text-white' 
                  : 'text-cyber-blue-400 hover:text-white hover:bg-cyber-blue-500/20'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl bg-cyber-blue-500/30 border border-cyber-blue-400/50 box-glow-blue"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon size={16} />
                <span className="hidden md:inline">{link.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

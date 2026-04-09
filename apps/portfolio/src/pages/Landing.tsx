import { motion } from 'framer-motion';
import { Code2, Database, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={containerVariants}
      className="relative w-full h-full bg-[#0a0f1c] flex flex-col items-center justify-center p-8 overflow-y-auto"
    >
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      <div className="relative z-10 max-w-5xl w-full">
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
            WILL BRACKEN
          </h1>
          <div className="h-1 w-24 bg-cyber-orange mx-auto mb-8 shadow-[0_0_10px_#ff6b00]" />
          <p className="text-lg md:text-xl text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
            SYSTEM ARCHITECT &amp; DATA SCIENTIST
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/github" className="group p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-cyber-blue-400 transition-all duration-300">
            <Code2 size={32} className="text-cyber-blue-400 mb-6 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-glow-blue transition-all">GitHub Galaxy</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Interactive 3D visualization of my entire codebase and project distributions.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-cyber-blue-400">
              EXPLORE_GALAXY <ArrowRight size={14} />
            </div>
          </Link>

          <Link to="/project/ms-teams-export" className="group p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-cyber-orange transition-all duration-300">
            <Database size={32} className="text-cyber-orange mb-6 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-glow-orange transition-all">Featured Work</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Deep dives into AI vision pipelines, data engineering, and system scripts.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-cyber-orange">
              VIEW_PROJECTS <ArrowRight size={14} />
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 flex justify-center gap-6">
          <a href="https://github.com/brackenw3" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
            <ExternalLink size={24} />
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

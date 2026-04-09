import { motion } from 'framer-motion';
import { DigitalRain } from '../components/UI/DigitalRain';
import { Code2, Database, Cpu, ArrowRight } from 'lucide-react';
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
    hidden: { y: 30, opacity: 0 },
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
      className="relative w-full h-full p-12 lg:p-24 overflow-y-auto"
    >
      <DigitalRain />
      
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col justify-center min-h-full">
        <motion.div variants={itemVariants} className="mb-16">
          <h1 className="text-6xl lg:text-8xl font-bold text-white tracking-tighter mb-6 text-glow-blue">
            BUILDING THE <span className="text-cyber-orange text-glow-orange">FUTURE.</span>
          </h1>
          <p className="text-xl text-cyber-blue-400 font-mono max-w-3xl leading-relaxed">
            Welcome to the central portfolio. This platform showcases cutting-edge data science, AI vision architectures, robust cloud infrastructure, and interactive 3D visualizations of my entire codebase.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/github" className="group relative border border-cyber-blue-500/30 bg-cyber-blue-900/60 p-8 rounded-2xl backdrop-blur-md hover:border-cyber-blue-400 transition-all duration-500 hover:box-glow-blue overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-cyber-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Code2 size={48} className="text-cyber-blue-400 mb-8 group-hover:text-white transition-colors duration-300" />
            <h2 className="text-2xl font-bold text-white mb-3">The Code Galaxy</h2>
            <p className="text-sm text-slate-400 mb-8">An interactive 3D visualization of the VSCode_Folders monorepo and live GitHub activity.</p>
            <div className="flex items-center gap-2 text-cyber-blue-400 font-mono text-xs font-bold group-hover:translate-x-2 transition-transform">
              EXPLORE REPOS <ArrowRight size={14} />
            </div>
          </Link>

          <Link to="/project/snowflake-streamlit" className="group relative border border-cyber-blue-500/30 bg-cyber-blue-900/60 p-8 rounded-2xl backdrop-blur-md hover:border-cyber-orange transition-all duration-500 hover:box-glow-orange overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-cyber-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Database size={48} className="text-cyber-orange mb-8 group-hover:text-white transition-colors duration-300" />
            <h2 className="text-2xl font-bold text-white mb-3">Data Engineering</h2>
            <p className="text-sm text-slate-400 mb-8">Zero-movement data architectures, Snowflake Streamlit apps, and high-performance pipelines.</p>
            <div className="flex items-center gap-2 text-cyber-orange font-mono text-xs font-bold group-hover:translate-x-2 transition-transform">
              VIEW PROJECTS <ArrowRight size={14} />
            </div>
          </Link>

          <Link to="/project/ai-vision" className="group relative border border-cyber-blue-500/30 bg-cyber-blue-900/60 p-8 rounded-2xl backdrop-blur-md hover:border-emerald-400 transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0)_inset] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)_inset] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Cpu size={48} className="text-emerald-400 mb-8 group-hover:text-white transition-colors duration-300" />
            <h2 className="text-2xl font-bold text-white mb-3">AI & Vision</h2>
            <p className="text-sm text-slate-400 mb-8">Local LLM orchestration, multi-modal vision parsing, and RTX 4080 compute bridging.</p>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold group-hover:translate-x-2 transition-transform">
              VIEW ARCHITECTURE <ArrowRight size={14} />
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
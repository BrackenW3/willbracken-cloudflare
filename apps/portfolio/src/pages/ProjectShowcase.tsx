import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, ExternalLink, Activity, Terminal as TerminalIcon, Cpu, Database } from 'lucide-react';
import { PROJECTS_DATA } from '../data/projects';
import { DigitalRain } from '../components/UI/DigitalRain';

export function ProjectShowcase() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? PROJECTS_DATA[projectId as keyof typeof PROJECTS_DATA] : null;

  if (!project) {
    return (
      <div className="w-full h-full flex items-center justify-center text-cyber-blue-400 font-mono">
        404_NODE_NOT_FOUND
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      className="w-full h-full pt-32 px-8 pb-8 overflow-y-auto"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Project Info */}
        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
          <div className="border border-cyber-blue-500/30 bg-cyber-blue-900/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Glow Accent */}
            <div 
              className="absolute top-0 left-0 w-full h-1"
              style={{ backgroundColor: project.primaryColor, boxShadow: `0 0 20px ${project.primaryColor}` }}
            />
            
            <h1 className="text-3xl font-bold text-white mb-4" style={{ textShadow: `0 0 10px ${project.primaryColor}40` }}>
              {project.title}
            </h1>
            
            <p className="text-slate-300 leading-relaxed text-sm mb-6">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map(tag => (
                <span key={tag} className="px-3 py-1 text-[10px] font-mono rounded-full border border-cyber-blue-500/30 text-cyber-blue-400 bg-cyber-blue-800/50">
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="text-xs font-bold text-white font-mono tracking-wider mb-4 border-b border-cyber-blue-500/30 pb-2">KEY_FEATURES</h3>
            <ul className="flex flex-col gap-3 mb-8">
              {project.features.map((feature, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <Activity size={14} className="mt-0.5 shrink-0" style={{ color: project.primaryColor }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex gap-4">
              <button 
                onClick={() => window.open(project.githubUrl, '_blank')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-cyber-blue-900 hover:bg-slate-200 transition-colors"
              >
                <Globe size={16} />
                SOURCE
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-cyber-blue-500/30 text-cyber-blue-400 hover:text-white hover:bg-cyber-blue-500/20 transition-all text-xs font-bold">
                <ExternalLink size={16} />
                DEPLOY
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Interactive Demo/Showcase */}
        <motion.div variants={itemVariants} className="lg:col-span-8">
          <div className="w-full h-full min-h-[600px] border border-cyber-blue-500/30 bg-cyber-blue-900/60 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Fake Browser/Terminal Header */}
            <div className="h-10 bg-cyber-blue-800/80 border-b border-cyber-blue-500/30 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto px-4 py-1 rounded-md bg-cyber-blue-900/80 text-[10px] font-mono text-cyber-blue-400 flex items-center gap-2">
                {project.demoType === 'terminal' ? <TerminalIcon size={12} /> : <Activity size={12} />}
                {project.demoType === 'terminal' ? `bash - user@rtx4080: ~/projects/${project.id}` : `https://deployed-${project.id}.willbracken.com`}
              </div>
            </div>

            {/* Interactive Content Area */}
            <div className="flex-1 p-6 relative">
              <DigitalRain />
              {project.demoType === 'terminal' && (
                <div className="font-mono text-sm leading-relaxed">
                  <p className="text-emerald-400">$ python analyze_teams.py --input raw_export.json --output structured.csv</p>
                  <p className="text-slate-400 mt-2">[INFO] Loading 12.4GB JSON export...</p>
                  <p className="text-slate-400">[INFO] Structuring threaded conversations...</p>
                  <p className="text-slate-400">[INFO] Identifying primary analytical nodes...</p>
                  <p className="text-emerald-400 mt-4">SUCCESS: 4.2 Million records parsed. Output saved to structured.csv.</p>
                  <p className="text-cyber-blue-400 mt-4">$ _</p>
                </div>
              )}

              {project.demoType === 'dashboard' && (
                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-cyber-blue-500/30 rounded-xl bg-cyber-blue-800/20 text-cyber-blue-400 font-mono relative overflow-hidden">
                   <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <Database size={200} />
                   </div>
                   <h3 className="text-xl text-white font-bold mb-2 relative z-10">Snowflake Streamlit UI</h3>
                   <p className="text-sm text-slate-300 max-w-md text-center relative z-10">Interactive dashboard simulation initialized. Connected to Snowpark compute cluster.</p>
                </div>
              )}

              {project.demoType === 'vision' && (
                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-cyber-orange/30 rounded-xl bg-cyber-orange/5 text-cyber-orange font-mono relative overflow-hidden">
                   <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <Cpu size={200} />
                   </div>
                   <h3 className="text-xl text-white font-bold mb-2 relative z-10">llama3.2-vision:11b Engine</h3>
                   <p className="text-sm text-slate-300 max-w-md text-center relative z-10">Awaiting image tensor input on RTX 4080 (16GB VRAM)...</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}

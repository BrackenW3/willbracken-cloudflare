import { CodeGalaxy } from '../components/CodeGalaxy/CodeGalaxy';
import { Overlay } from '../components/UI/Overlay';
import { motion } from 'framer-motion';

export function GithubPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-full"
    >
      <CodeGalaxy />
      <Overlay />
    </motion.div>
  );
}
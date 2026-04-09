import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Landing } from './pages/Landing';
import { ProjectShowcase } from './pages/ProjectShowcase';
import { Navigation } from './components/UI/Navigation';

function App() {
  const location = useLocation();

  return (
    <main className="relative w-full h-screen overflow-hidden bg-cyber-blue-900 text-slate-200">
      <Navigation />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/project/:projectId" element={<ProjectShowcase />} />
        </Routes>
      </AnimatePresence>
    </main>
  );
}

export default App;

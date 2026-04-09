import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Landing } from './pages/Landing';
import { GithubPage } from './pages/GithubPage';
import { ProjectShowcase } from './pages/ProjectShowcase';
import { InternalAnalytics } from './pages/InternalAnalytics';
import { Sidebar } from './components/UI/Sidebar';

function App() {
  const location = useLocation();

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#0a0f1c] text-slate-200">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/github" element={<GithubPage />} />
            <Route path="/project/:projectId" element={<ProjectShowcase />} />
            <Route path="/internal-analytics" element={<InternalAnalytics />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
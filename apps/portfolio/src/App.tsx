import { CodeGalaxy } from './components/CodeGalaxy/CodeGalaxy';
import { Overlay } from './components/UI/Overlay';

function App() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-cyber-blue-900">
      <CodeGalaxy />
      <Overlay />
    </main>
  );
}

export default App;

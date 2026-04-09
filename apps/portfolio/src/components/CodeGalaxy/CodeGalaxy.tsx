import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Stars } from './Stars';
import { GalaxyNodes } from './GalaxyNodes';
import { PostProcessing } from './PostProcessing';

export function CodeGalaxy() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 bg-cyber-blue-900">
      <Canvas camera={{ position: [0, 10, 40], fov: 60 }}>
        <color attach="background" args={['#0a0f1c']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b00" />

        {/* Scene Elements */}
        <Stars count={8000} />
        <GalaxyNodes />
        
        {/* Effects & Controls */}
        <PostProcessing />
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          maxDistance={60}
          minDistance={10}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

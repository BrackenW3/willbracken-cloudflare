import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';

const LANG_COLORS: Record<string, string> = {
  Go: '#00ADD8', Python: '#3776AB', JavaScript: '#F7DF1E', TypeScript: '#3178C6',
  HTML: '#E34F26', CSS: '#1572B6', Shell: '#4EAA25', Dockerfile: '#2496ED', default: '#8892a4'
};

interface Repo {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
}

export function GalaxyNodes() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Fetch real repos or fallback
    const load = async () => {
      try {
        const res = await fetch('https://api.github.com/users/brackenw3/repos?per_page=100&sort=stars');
        if (res.ok) {
          const data = await res.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setRepos(data.filter((r: any) => !r.fork && !r.private).slice(0, 15));
        } else {
          throw new Error();
        }
      } catch {
        setRepos([
          { name: 'VSCode_Folders', description: 'Main monorepo', language: 'TypeScript', stargazers_count: 5, forks_count: 2, html_url: 'https://github.com/brackenw3/VSCode_Folders' },
          { name: 'brackenw3.github.io', description: 'Portfolio site', language: 'JavaScript', stargazers_count: 12, forks_count: 4, html_url: 'https://github.com/brackenw3/brackenw3.github.io' },
          { name: 'Go-Scripts', description: 'Go tooling', language: 'Go', stargazers_count: 8, forks_count: 1, html_url: 'https://github.com/brackenw3/Go-Scripts' },
          { name: 'GH_Models', description: 'AI gateway', language: 'Python', stargazers_count: 20, forks_count: 5, html_url: 'https://github.com/brackenw3/GH_Models' },
        ]);
      }
    };
    load();
  }, []);

  return (
    <group ref={groupRef}>
      <CentralCore />
      {repos.map((repo, idx) => (
        <OrbitingRepo 
          key={repo.name} 
          repo={repo} 
          index={idx} 
          isHovered={hovered === repo.name}
          onHover={() => setHovered(repo.name)}
          onUnhover={() => setHovered(null)}
        />
      ))}
    </group>
  );
}

function CentralCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.05;
      meshRef.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#00d4ff" 
          emissiveIntensity={2} 
          toneMapped={false}
        />
      </mesh>
      <Text
        position={[0, 0, 3]}
        fontSize={1}
        color="white"
        font="/fonts/JetBrainsMono.ttf" // Fallback to system if not found
      >
        WB
      </Text>
      {/* Outer Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.8, 64]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function OrbitingRepo({ repo, index, isHovered, onHover, onUnhover }: { repo: Repo, index: number, isHovered: boolean, onHover: () => void, onUnhover: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const radius = 12 + index * 4;
  const speed = 0.05 + Math.random() * 0.1;
  const initialAngle = index * (Math.PI * 2 / 10);
  
  const color = LANG_COLORS[repo.language] || LANG_COLORS.default;

  useFrame((state) => {
    if (groupRef.current && !isHovered) {
      const angle = initialAngle + state.clock.elapsedTime * speed * 0.2;
      groupRef.current.position.x = Math.cos(angle) * radius;
      groupRef.current.position.z = Math.sin(angle) * radius;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 1.5;
    }
  });

  return (
    <group>
      {/* Orbit Line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.05, radius + 0.05, 128]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>

      <group 
        ref={groupRef}
        onPointerOver={(e) => { e.stopPropagation(); onHover(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { onUnhover(); document.body.style.cursor = 'auto'; }}
        onClick={() => window.open(repo.html_url, '_blank')}
      >
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial 
              color={color} 
              emissive={color} 
              emissiveIntensity={isHovered ? 4 : 1}
              toneMapped={false} 
            />
          </mesh>
          
          <mesh>
            <sphereGeometry args={[1.2, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.1} />
          </mesh>

          {isHovered && (
            <group position={[0, 1.5, 0]}>
              <Text fontSize={0.6} color="white" anchorX="center" outlineWidth={0.05} outlineColor="black">
                {repo.name}
              </Text>
              <Text position={[0, -0.6, 0]} fontSize={0.3} color="#7a8ba0" anchorX="center">
                {repo.language}
              </Text>
            </group>
          )}
        </Float>

        {/* Connection Line to Core */}
        <Line 
          points={[[0, 0, 0], [0, 0, 0]]} // Logic handled by frame or static if needed
          color={color}
          lineWidth={0.5}
          transparent
          opacity={0.1}
        />
      </group>
    </group>
  );
}

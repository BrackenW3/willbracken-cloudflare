import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface LangData {
  c: string;
  pct: number;
}

interface NodeData {
  id: number;
  position: THREE.Vector3;
  name: string;
  url: string;
  size: number;
  commits: number;
  langs: LangData[];
}

// Language colors for rings
const COLORS = {
  ts: '#3b82f6', // Cyber Blue
  python: '#10b981', // Emerald
  rust: '#ff6b00', // Cyber Orange
  go: '#06b6d4', // Cyan
};

const REPOS = [
  { name: 'VSCode_Folders', url: 'https://github.com/brackenw3/VSCode_Folders', langs: [{ c: COLORS.ts, pct: 0.6 }, { c: COLORS.python, pct: 0.4 }], size: 1.8, commits: 12400 },
  { name: 'n8n-automations', url: 'https://github.com/brackenw3/n8n-automations', langs: [{ c: COLORS.ts, pct: 1.0 }], size: 1.5, commits: 3200 },
  { name: 'cloud-infra-d2', url: 'https://github.com/brackenw3/cloud-infra', langs: [{ c: COLORS.rust, pct: 0.7 }, { c: COLORS.ts, pct: 0.3 }], size: 1.2, commits: 1500 },
  { name: 'ai-vision-agent', url: 'https://github.com/brackenw3/ai-vision', langs: [{ c: COLORS.python, pct: 0.8 }, { c: COLORS.go, pct: 0.2 }], size: 1.4, commits: 2100 },
  { name: 'CodeGalaxy', url: 'https://github.com/brackenw3/willbracken-cloudflare', langs: [{ c: COLORS.ts, pct: 1.0 }], size: 1.6, commits: 450 },
  { name: 'portfolio-v1', url: 'https://github.com/brackenw3/portfolio-v1', langs: [{ c: COLORS.ts, pct: 0.9 }, { c: COLORS.python, pct: 0.1 }], size: 1.0, commits: 800 },
  { name: 'data-pipeline', url: 'https://github.com/brackenw3/data-pipeline', langs: [{ c: COLORS.python, pct: 0.7 }, { c: COLORS.rust, pct: 0.3 }], size: 1.3, commits: 1800 },
  { name: 'llm-finetuning', url: 'https://github.com/brackenw3/llm-finetuning', langs: [{ c: COLORS.python, pct: 1.0 }], size: 1.5, commits: 2400 },
  { name: 'discord-bot-rs', url: 'https://github.com/brackenw3/discord-bot', langs: [{ c: COLORS.rust, pct: 1.0 }], size: 0.9, commits: 340 },
  { name: 'trading-algo', url: 'https://github.com/brackenw3/trading-algo', langs: [{ c: COLORS.go, pct: 0.6 }, { c: COLORS.python, pct: 0.4 }], size: 1.1, commits: 950 },
];

// Distribute them in 3D space
const MOCK_NODES = REPOS.map((repo, i) => ({
  id: i,
  position: new THREE.Vector3(
    (Math.random() - 0.5) * 35,
    (Math.random() - 0.5) * 25,
    (Math.random() - 0.5) * 35
  ),
  ...repo
}));

function LanguageRings({ size, langs }: { size: number; langs: { c: string; pct: number }[] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  // Pre-calculate cumulative angles
  const ringSegments = useMemo(() => {
    return langs.map((lang, index) => {
      const thetaLength = lang.pct * Math.PI * 2;
      const startAngle = langs.slice(0, index).reduce((acc, curr) => acc + (curr.pct * Math.PI * 2), 0);
      return { ...lang, thetaLength, startAngle };
    });
  }, [langs]);

  return (
    <group ref={groupRef}>
      {ringSegments.map((segment, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, segment.startAngle]}>
          <torusGeometry args={[size * 1.8, 0.05, 16, 64, segment.thetaLength]} />
          <meshBasicMaterial color={segment.c} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

export function GalaxyNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [nodesData, setNodesData] = useState(MOCK_NODES);

  // Fetch real data from the Cloudflare Worker API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          if (data.projects && data.projects.length > 0) {
            // Map Supabase data to the format expected by the visualizer
            const mappedNodes = data.projects.map((repo: Record<string, unknown>, i: number) => {
              // Extract primary language color or default
              const langs = repo.languages as Array<Record<string, unknown>> | undefined;
              const primaryColor = langs && langs[0] ? (langs[0].color as string) : '#3b82f6';
              return {
                id: (repo.id as number) || i,
                position: new THREE.Vector3(
                  (Math.random() - 0.5) * 35,
                  (Math.random() - 0.5) * 25,
                  (Math.random() - 0.5) * 35
                ),
                name: (repo.name as string),
                url: (repo.url as string),
                size: (repo.size as number) || 1.5,
                commits: (repo.commits as number) || 0,
                langs: (langs as unknown as LangData[]) || [{ c: primaryColor, pct: 1.0 }]
              };
            });
            setNodesData(mappedNodes);
          }
        }
      } catch (err) {
        console.warn('Using fallback galaxy data. API not reachable:', err);
      }
    };
    fetchProjects();
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  const handlePointerOver = (id: number) => {
    setHoveredNode(id);
  };

  const handlePointerOut = () => {
    setHoveredNode(null);
  };

  useEffect(() => {
    document.body.style.cursor = hoveredNode !== null ? 'pointer' : 'auto';
  }, [hoveredNode]);

  const handleClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <group ref={groupRef}>
      {nodesData.map((node) => {
        const isHovered = hoveredNode === node.id;
        const primaryColor = node.langs[0].c;
        const scale = isHovered ? 1.2 : 1;

        return (
          <group 
            key={node.id} 
            position={node.position}
            scale={[scale, scale, scale]}
            onPointerOver={() => handlePointerOver(node.id)}
            onPointerOut={handlePointerOut}
            onClick={() => handleClick(node.url)}
          >
            {/* Node Core */}
            <mesh>
              <sphereGeometry args={[node.size, 32, 32]} />
              <meshStandardMaterial 
                color={primaryColor} 
                emissive={primaryColor}
                emissiveIntensity={isHovered ? 4 : 2}
                toneMapped={false}
              />
            </mesh>
            
            {/* Node Halo/Glow */}
            <mesh>
              <sphereGeometry args={[node.size * 1.4, 32, 32]} />
              <meshBasicMaterial 
                color={primaryColor}
                transparent
                opacity={isHovered ? 0.3 : 0.15}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>

            {/* Language Percentage Rings */}
            <LanguageRings size={node.size} langs={node.langs} />

            {/* Label */}
            <Text
              position={[0, node.size * 2 + 0.5, 0]}
              fontSize={0.8}
              color={isHovered ? "#ffffff" : "#e2e8f0"}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.05}
              outlineColor="#0a0f1c"
            >
              {node.name}
            </Text>
            
            {isHovered && (
               <Text
               position={[0, node.size * 2 - 0.3, 0]}
               fontSize={0.4}
               color="#ff6b00"
               anchorX="center"
               anchorY="middle"
               outlineWidth={0.03}
               outlineColor="#0a0f1c"
             >
               {node.commits.toLocaleString()} commits
             </Text>
            )}
          </group>
        );
      })}

      {/* Connection Lines (Simulated network) */}
      <Connections nodes={nodesData} />
    </group>
  );
}

function Connections({ nodes }: { nodes: NodeData[] }) {
  const lineGeometry = useMemo(() => {
    const points = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < 20) {
          points.push(nodes[i].position);
          points.push(nodes[j].position);
        }
      }
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [nodes]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial 
        color="#1f3b73" 
        transparent 
        opacity={0.2} 
        blending={THREE.AdditiveBlending} 
      />
    </lineSegments>
  );
}

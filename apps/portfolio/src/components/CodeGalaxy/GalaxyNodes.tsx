import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Mock data representing projects/commits
const MOCK_NODES = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  position: new THREE.Vector3(
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 30
  ),
  size: Math.random() * 1.5 + 0.5,
  color: Math.random() > 0.8 ? '#ff6b00' : '#3b82f6', // Mostly blue, some orange
  label: `Project-${i}`,
  commits: Math.floor(Math.random() * 500)
}));

export function GalaxyNodes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {MOCK_NODES.map((node) => (
        <group key={node.id} position={node.position}>
          {/* Node Core */}
          <mesh>
            <sphereGeometry args={[node.size, 32, 32]} />
            <meshStandardMaterial 
              color={node.color} 
              emissive={node.color}
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
          
          {/* Node Halo/Glow */}
          <mesh>
            <sphereGeometry args={[node.size * 1.5, 32, 32]} />
            <meshBasicMaterial 
              color={node.color}
              transparent
              opacity={0.15}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Label */}
          <Text
            position={[0, node.size + 1, 0]}
            fontSize={0.8}
            color="#e2e8f0"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#0a0f1c"
          >
            {node.label}
          </Text>
        </group>
      ))}

      {/* Connection Lines (Simulated network) */}
      <Connections nodes={MOCK_NODES} />
    </group>
  );
}

function Connections({ nodes }: { nodes: typeof MOCK_NODES }) {
  const lineGeometry = useMemo(() => {
    const points = [];
    // Connect some nodes together
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < 12) {
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
        opacity={0.3} 
        blending={THREE.AdditiveBlending} 
      />
    </lineSegments>
  );
}

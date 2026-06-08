'use client';
import { forwardRef } from 'react';
import { Group } from 'three';

interface Props { color?: string; isNight?: boolean; }

const Wheel = ({ pos }: { pos: [number, number, number] }) => (
  <group position={pos} rotation={[0, 0, Math.PI / 2]}>
    <mesh castShadow>
      <cylinderGeometry args={[0.36, 0.36, 0.28, 20]} />
      <meshStandardMaterial color="#111" roughness={0.9} />
    </mesh>
    <mesh>
      <cylinderGeometry args={[0.22, 0.22, 0.3, 8]} />
      <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.2} />
    </mesh>
    <mesh>
      <cylinderGeometry args={[0.1, 0.1, 0.31, 8]} />
      <meshStandardMaterial color="#555" metalness={0.7} />
    </mesh>
  </group>
);

export const PlayerCarMesh = forwardRef<Group, Props>(({ color = '#e11d48', isNight = false }, ref) => {
  const emissive = isNight ? 3 : 1.2;
  return (
    <group ref={ref}>
      {/* Main body */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[2.1, 0.72, 4.4]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Roof / cabin */}
      <mesh position={[0, 1.18, 0.15]} castShadow>
        <boxGeometry args={[1.65, 0.62, 2.3]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.08, 1.18]} rotation={[0.38, 0, 0]}>
        <boxGeometry args={[1.5, 0.52, 0.05]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.55} metalness={0.9} roughness={0.05} />
      </mesh>
      {/* Rear window */}
      <mesh position={[0, 1.06, -0.95]} rotation={[-0.42, 0, 0]}>
        <boxGeometry args={[1.5, 0.48, 0.05]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.55} metalness={0.9} roughness={0.05} />
      </mesh>
      {/* Side windows L */}
      <mesh position={[0.84, 1.18, 0.15]}>
        <boxGeometry args={[0.04, 0.38, 1.8]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.4} metalness={0.9} />
      </mesh>
      {/* Side windows R */}
      <mesh position={[-0.84, 1.18, 0.15]}>
        <boxGeometry args={[0.04, 0.38, 1.8]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.4} metalness={0.9} />
      </mesh>
      {/* Front bumper */}
      <mesh position={[0, 0.28, 2.28]}>
        <boxGeometry args={[2.0, 0.32, 0.18]} />
        <meshStandardMaterial color="#222" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Rear bumper */}
      <mesh position={[0, 0.28, -2.28]}>
        <boxGeometry args={[2.0, 0.32, 0.18]} />
        <meshStandardMaterial color="#222" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Hood spoiler */}
      <mesh position={[0, 1.0, -2.05]}>
        <boxGeometry args={[1.8, 0.1, 0.5]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Grille */}
      <mesh position={[0, 0.48, 2.22]}>
        <boxGeometry args={[1.4, 0.22, 0.06]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Headlights L */}
      <mesh position={[0.68, 0.55, 2.24]}>
        <boxGeometry args={[0.48, 0.18, 0.06]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={emissive} />
      </mesh>
      {/* Headlights R */}
      <mesh position={[-0.68, 0.55, 2.24]}>
        <boxGeometry args={[0.48, 0.18, 0.06]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={emissive} />
      </mesh>
      {/* DRL strips */}
      <mesh position={[0.68, 0.42, 2.24]}>
        <boxGeometry args={[0.55, 0.06, 0.06]} />
        <meshStandardMaterial color="#88bbff" emissive="#88bbff" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-0.68, 0.42, 2.24]}>
        <boxGeometry args={[0.55, 0.06, 0.06]} />
        <meshStandardMaterial color="#88bbff" emissive="#88bbff" emissiveIntensity={1.5} />
      </mesh>
      {/* Taillights L */}
      <mesh position={[0.68, 0.55, -2.24]}>
        <boxGeometry args={[0.48, 0.2, 0.06]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={isNight ? 3 : 1.5} />
      </mesh>
      {/* Taillights R */}
      <mesh position={[-0.68, 0.55, -2.24]}>
        <boxGeometry args={[0.48, 0.2, 0.06]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={isNight ? 3 : 1.5} />
      </mesh>
      {/* Exhaust */}
      <mesh position={[0.4, 0.2, -2.28]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 8]} />
        <meshStandardMaterial color="#555" metalness={0.9} />
      </mesh>
      <mesh position={[-0.4, 0.2, -2.28]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 8]} />
        <meshStandardMaterial color="#555" metalness={0.9} />
      </mesh>
      {/* Wheels */}
      <Wheel pos={[1.12, 0.36, 1.45]} />
      <Wheel pos={[-1.12, 0.36, 1.45]} />
      <Wheel pos={[1.12, 0.36, -1.45]} />
      <Wheel pos={[-1.12, 0.36, -1.45]} />
      {/* Undercarriage */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.6, 0.12, 4.0]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
});

PlayerCarMesh.displayName = 'PlayerCarMesh';

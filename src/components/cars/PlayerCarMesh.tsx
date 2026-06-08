'use client';
import { forwardRef } from 'react';
import { Group } from 'three';

interface Props { color?: string; isNight?: boolean; }

const Wheel = ({ pos, flip = false }: { pos: [number, number, number]; flip?: boolean }) => (
  <group position={pos} rotation={[0, flip ? Math.PI : 0, 0]}>
    {/* Tire */}
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.38, 0.38, 0.28, 24]} />
      <meshStandardMaterial color="#111" roughness={0.95} metalness={0.0} />
    </mesh>
    {/* Rim outer */}
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.26, 0.26, 0.295, 20]} />
      <meshStandardMaterial color="#c8c8c8" metalness={0.92} roughness={0.12} />
    </mesh>
    {/* Rim spokes - 5 spoke design */}
    {[0, 1, 2, 3, 4].map(i => (
      <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI * 2) / 5]} position={[0, 0, 0]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.15} />
      </mesh>
    ))}
    {/* Center cap */}
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 0.31, 8]} />
      <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
    </mesh>
    {/* Brake disc */}
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, flip ? -0.11 : 0.11]}>
      <cylinderGeometry args={[0.2, 0.2, 0.03, 16]} />
      <meshStandardMaterial color="#555" metalness={0.7} roughness={0.4} />
    </mesh>
  </group>
);

export const PlayerCarMesh = forwardRef<Group, Props>(({ color = '#e11d48', isNight = false }, ref) => {
  const emiNight = isNight ? 4 : 1.5;
  const bodyRoughness = 0.18;
  const bodyMetal = 0.75;

  return (
    <group ref={ref}>
      {/* === LOWER BODY === */}
      {/* Main body sill (widest part) */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[2.14, 0.62, 4.5]} />
        <meshStandardMaterial color={color} metalness={bodyMetal} roughness={bodyRoughness} envMapIntensity={1.2} />
      </mesh>

      {/* Front fender flares */}
      <mesh position={[1.09, 0.44, 1.35]} castShadow>
        <boxGeometry args={[0.12, 0.56, 1.1]} />
        <meshStandardMaterial color={color} metalness={bodyMetal} roughness={bodyRoughness} />
      </mesh>
      <mesh position={[-1.09, 0.44, 1.35]} castShadow>
        <boxGeometry args={[0.12, 0.56, 1.1]} />
        <meshStandardMaterial color={color} metalness={bodyMetal} roughness={bodyRoughness} />
      </mesh>
      {/* Rear fender flares */}
      <mesh position={[1.09, 0.44, -1.5]} castShadow>
        <boxGeometry args={[0.12, 0.56, 1.1]} />
        <meshStandardMaterial color={color} metalness={bodyMetal} roughness={bodyRoughness} />
      </mesh>
      <mesh position={[-1.09, 0.44, -1.5]} castShadow>
        <boxGeometry args={[0.12, 0.56, 1.1]} />
        <meshStandardMaterial color={color} metalness={bodyMetal} roughness={bodyRoughness} />
      </mesh>

      {/* Side skirts */}
      <mesh position={[1.06, 0.14, 0.05]}>
        <boxGeometry args={[0.06, 0.16, 3.4]} />
        <meshStandardMaterial color="#111" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[-1.06, 0.14, 0.05]}>
        <boxGeometry args={[0.06, 0.16, 3.4]} />
        <meshStandardMaterial color="#111" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* === HOOD (sloped wedge) === */}
      {/* Flat top hood panel */}
      <mesh position={[0, 0.76, 1.2]} rotation={[-0.08, 0, 0]} castShadow>
        <boxGeometry args={[2.0, 0.06, 1.7]} />
        <meshStandardMaterial color={color} metalness={bodyMetal + 0.05} roughness={bodyRoughness - 0.05} envMapIntensity={1.5} />
      </mesh>
      {/* Hood slope front */}
      <mesh position={[0, 0.6, 2.1]} rotation={[-0.52, 0, 0]} castShadow>
        <boxGeometry args={[1.9, 0.06, 0.7]} />
        <meshStandardMaterial color={color} metalness={bodyMetal} roughness={bodyRoughness} />
      </mesh>
      {/* Hood vent scoops */}
      <mesh position={[0.45, 0.77, 1.0]}>
        <boxGeometry args={[0.28, 0.04, 0.7]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      <mesh position={[-0.45, 0.77, 1.0]}>
        <boxGeometry args={[0.28, 0.04, 0.7]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>

      {/* === CABIN === */}
      {/* Cabin lower (A-pillar base) */}
      <mesh position={[0, 0.96, 0.22]} castShadow>
        <boxGeometry args={[1.82, 0.22, 2.55]} />
        <meshStandardMaterial color={color} metalness={bodyMetal} roughness={bodyRoughness} />
      </mesh>
      {/* Cabin glass area */}
      <mesh position={[0, 1.32, 0.08]} castShadow>
        <boxGeometry args={[1.72, 0.5, 2.1]} />
        <meshStandardMaterial color="#0a0a12" metalness={0.1} roughness={0.05} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.6, -0.05]} castShadow>
        <boxGeometry args={[1.7, 0.1, 1.85]} />
        <meshStandardMaterial color={color} metalness={bodyMetal + 0.05} roughness={bodyRoughness} envMapIntensity={1.5} />
      </mesh>

      {/* Windshield glass */}
      <mesh position={[0, 1.3, 1.14]} rotation={[-0.46, 0, 0]}>
        <boxGeometry args={[1.6, 0.62, 0.05]} />
        <meshStandardMaterial color="#88bbdd" transparent opacity={0.45} metalness={0.95} roughness={0.0} envMapIntensity={2.0} />
      </mesh>
      {/* Rear window glass */}
      <mesh position={[0, 1.26, -1.1]} rotation={[0.52, 0, 0]}>
        <boxGeometry args={[1.6, 0.55, 0.05]} />
        <meshStandardMaterial color="#88bbdd" transparent opacity={0.4} metalness={0.95} roughness={0.0} envMapIntensity={2.0} />
      </mesh>
      {/* Side windows */}
      <mesh position={[0.87, 1.32, 0.06]}>
        <boxGeometry args={[0.04, 0.42, 1.65]} />
        <meshStandardMaterial color="#99ccee" transparent opacity={0.38} metalness={0.9} roughness={0.0} />
      </mesh>
      <mesh position={[-0.87, 1.32, 0.06]}>
        <boxGeometry args={[0.04, 0.42, 1.65]} />
        <meshStandardMaterial color="#99ccee" transparent opacity={0.38} metalness={0.9} roughness={0.0} />
      </mesh>

      {/* A-pillar */}
      <mesh position={[0.82, 1.18, 1.0]} rotation={[0.46, 0, 0.12]}>
        <boxGeometry args={[0.07, 0.62, 0.07]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-0.82, 1.18, 1.0]} rotation={[0.46, 0, -0.12]}>
        <boxGeometry args={[0.07, 0.62, 0.07]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* C-pillar */}
      <mesh position={[0.82, 1.2, -1.02]} rotation={[-0.52, 0, -0.1]}>
        <boxGeometry args={[0.07, 0.58, 0.07]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-0.82, 1.2, -1.02]} rotation={[-0.52, 0, 0.1]}>
        <boxGeometry args={[0.07, 0.58, 0.07]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* === TRUNK / REAR === */}
      {/* Trunk lid */}
      <mesh position={[0, 0.76, -1.85]} rotation={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[1.88, 0.07, 1.25]} />
        <meshStandardMaterial color={color} metalness={bodyMetal} roughness={bodyRoughness} envMapIntensity={1.3} />
      </mesh>
      {/* Rear spoiler */}
      <mesh position={[0, 1.08, -2.22]}>
        <boxGeometry args={[1.75, 0.07, 0.38]} />
        <meshStandardMaterial color={color} metalness={bodyMetal + 0.1} roughness={0.1} />
      </mesh>
      {/* Spoiler stands */}
      <mesh position={[0.65, 0.92, -2.18]}>
        <boxGeometry args={[0.06, 0.28, 0.16]} />
        <meshStandardMaterial color="#111" metalness={0.7} />
      </mesh>
      <mesh position={[-0.65, 0.92, -2.18]}>
        <boxGeometry args={[0.06, 0.28, 0.16]} />
        <meshStandardMaterial color="#111" metalness={0.7} />
      </mesh>
      {/* Rear diffuser */}
      <mesh position={[0, 0.14, -2.28]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[1.85, 0.12, 0.45]} />
        <meshStandardMaterial color="#111" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* === FRONT === */}
      {/* Front bumper lower */}
      <mesh position={[0, 0.22, 2.28]}>
        <boxGeometry args={[2.1, 0.28, 0.16]} />
        <meshStandardMaterial color="#111" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Front splitter */}
      <mesh position={[0, 0.08, 2.3]}>
        <boxGeometry args={[1.9, 0.06, 0.28]} />
        <meshStandardMaterial color="#222" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Central grille */}
      <mesh position={[0, 0.36, 2.26]}>
        <boxGeometry args={[1.1, 0.24, 0.08]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      {/* Lower grille mesh */}
      <mesh position={[0, 0.18, 2.27]}>
        <boxGeometry args={[1.5, 0.18, 0.06]} />
        <meshStandardMaterial color="#080808" roughness={0.95} />
      </mesh>

      {/* === HEADLIGHTS (sharp modern LED) === */}
      {/* Main headlight housing */}
      <mesh position={[0.72, 0.5, 2.26]}>
        <boxGeometry args={[0.46, 0.2, 0.06]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={emiNight} />
      </mesh>
      <mesh position={[-0.72, 0.5, 2.26]}>
        <boxGeometry args={[0.46, 0.2, 0.06]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={emiNight} />
      </mesh>
      {/* DRL strips (bottom of headlight) */}
      <mesh position={[0.72, 0.37, 2.262]}>
        <boxGeometry args={[0.52, 0.05, 0.05]} />
        <meshStandardMaterial color="#aaddff" emissive="#aaddff" emissiveIntensity={3.0} />
      </mesh>
      <mesh position={[-0.72, 0.37, 2.262]}>
        <boxGeometry args={[0.52, 0.05, 0.05]} />
        <meshStandardMaterial color="#aaddff" emissive="#aaddff" emissiveIntensity={3.0} />
      </mesh>
      {/* DRL vertical corner piece */}
      <mesh position={[0.96, 0.42, 2.24]}>
        <boxGeometry args={[0.05, 0.22, 0.06]} />
        <meshStandardMaterial color="#aaddff" emissive="#aaddff" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[-0.96, 0.42, 2.24]}>
        <boxGeometry args={[0.05, 0.22, 0.06]} />
        <meshStandardMaterial color="#aaddff" emissive="#aaddff" emissiveIntensity={2.5} />
      </mesh>

      {/* === TAILLIGHTS (full-width LED bar) === */}
      {/* Center LED bar */}
      <mesh position={[0, 0.58, -2.27]}>
        <boxGeometry args={[1.85, 0.06, 0.05]} />
        <meshStandardMaterial color="#ff1100" emissive="#ff1100" emissiveIntensity={isNight ? 5 : 2} />
      </mesh>
      {/* Outer taillight clusters */}
      <mesh position={[0.72, 0.5, -2.26]}>
        <boxGeometry args={[0.44, 0.22, 0.06]} />
        <meshStandardMaterial color="#cc0000" emissive="#cc0000" emissiveIntensity={isNight ? 4 : 2.5} />
      </mesh>
      <mesh position={[-0.72, 0.5, -2.26]}>
        <boxGeometry args={[0.44, 0.22, 0.06]} />
        <meshStandardMaterial color="#cc0000" emissive="#cc0000" emissiveIntensity={isNight ? 4 : 2.5} />
      </mesh>
      {/* Reverse lights */}
      <mesh position={[0.3, 0.5, -2.27]}>
        <boxGeometry args={[0.18, 0.14, 0.04]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.3, 0.5, -2.27]}>
        <boxGeometry args={[0.18, 0.14, 0.04]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.3} />
      </mesh>

      {/* === EXHAUST === */}
      <mesh position={[0.55, 0.2, -2.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 10]} />
        <meshStandardMaterial color="#444" metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[0.55, 0.2, -2.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.15, 10]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      <mesh position={[-0.55, 0.2, -2.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 10]} />
        <meshStandardMaterial color="#444" metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[-0.55, 0.2, -2.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.15, 10]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>

      {/* Side mirrors */}
      <mesh position={[1.0, 0.9, 0.82]}>
        <boxGeometry args={[0.28, 0.12, 0.16]} />
        <meshStandardMaterial color={color} metalness={bodyMetal} roughness={bodyRoughness} />
      </mesh>
      <mesh position={[-1.0, 0.9, 0.82]}>
        <boxGeometry args={[0.28, 0.12, 0.16]} />
        <meshStandardMaterial color={color} metalness={bodyMetal} roughness={bodyRoughness} />
      </mesh>
      {/* Mirror glass */}
      <mesh position={[1.12, 0.9, 0.82]}>
        <boxGeometry args={[0.04, 0.1, 0.14]} />
        <meshStandardMaterial color="#334" metalness={0.98} roughness={0.0} envMapIntensity={2.0} />
      </mesh>
      <mesh position={[-1.12, 0.9, 0.82]}>
        <boxGeometry args={[0.04, 0.1, 0.14]} />
        <meshStandardMaterial color="#334" metalness={0.98} roughness={0.0} envMapIntensity={2.0} />
      </mesh>

      {/* Undercarriage */}
      <mesh position={[0, 0.06, 0.1]}>
        <boxGeometry args={[1.65, 0.1, 4.1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* === WHEELS === */}
      <Wheel pos={[1.13, 0.38, 1.5]} />
      <Wheel pos={[-1.13, 0.38, 1.5]} flip />
      <Wheel pos={[1.13, 0.38, -1.5]} />
      <Wheel pos={[-1.13, 0.38, -1.5]} flip />
    </group>
  );
});

PlayerCarMesh.displayName = 'PlayerCarMesh';

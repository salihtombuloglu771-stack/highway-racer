'use client';
import { useRef } from 'react';
import { Mesh } from 'three';
import { Sky, Stars } from '@react-three/drei';

interface Props { isNight: boolean }

const BUILDING_DATA = [
  { x: 18, z: -50, w: 8, h: 20, d: 10, color: '#445566' },
  { x: 28, z: -20, w: 6, h: 35, d: 8, color: '#334455' },
  { x: 20, z: 30, w: 10, h: 15, d: 12, color: '#556677' },
  { x: -18, z: -60, w: 8, h: 28, d: 10, color: '#443355' },
  { x: -28, z: -10, w: 6, h: 18, d: 8, color: '#334455' },
  { x: -22, z: 40, w: 10, h: 40, d: 12, color: '#445566' },
  { x: 35, z: -80, w: 12, h: 25, d: 14, color: '#223344' },
  { x: -35, z: -90, w: 12, h: 32, d: 14, color: '#332244' },
  { x: 40, z: 60, w: 8, h: 22, d: 10, color: '#445566' },
  { x: -40, z: 70, w: 8, h: 18, d: 10, color: '#334455' },
];

const TREE_POSITIONS = [-8, 8, -14, 14];
const TREE_Z_OFFSETS = [-30, 0, 30, 60, 90, 120, 150];

export function Environment({ isNight }: Props) {
  const groundRef = useRef<Mesh>(null);

  return (
    <>
      {/* Sky */}
      {isNight ? (
        <>
          <color attach="background" args={['#050510']} />
          <Stars radius={200} depth={50} count={3000} factor={4} fade />
          <ambientLight intensity={0.12} color="#1020ff" />
          <directionalLight
            position={[-30, 40, 20]}
            intensity={0.25}
            color="#4466cc"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={200}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />
        </>
      ) : (
        <>
          <Sky sunPosition={[100, 60, -100]} turbidity={8} rayleigh={0.5} azimuth={220} />
          <ambientLight intensity={0.6} color="#ffe8d0" />
          <directionalLight
            position={[30, 60, -50]}
            intensity={1.8}
            color="#fff5e0"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={200}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />
          <hemisphereLight args={['#aabbff', '#886644', 0.4]} />
        </>
      )}

      {/* Ground plane */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[300, 3000]} />
        <meshStandardMaterial color={isNight ? '#0e1a0e' : '#2d4a1e'} roughness={0.95} />
      </mesh>

      {/* Distant buildings (static decorations) */}
      {BUILDING_DATA.map((b, i) => (
        <group key={i} position={[b.x, 0, b.z]}>
          <mesh position={[0, b.h / 2, 0]}>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              color={b.color}
              roughness={0.7}
              metalness={0.2}
              emissive={b.color}
              emissiveIntensity={isNight ? 0.15 : 0}
            />
          </mesh>
          {/* Windows */}
          {isNight && Array.from({ length: Math.floor(b.h / 4) }).map((_, row) =>
            Array.from({ length: Math.floor(b.w / 2.5) }).map((_, col) =>
              Math.random() > 0.3 ? (
                <mesh
                  key={`${row}-${col}`}
                  position={[
                    -b.w / 2 + 1.25 + col * 2.5,
                    2 + row * 4,
                    b.d / 2 + 0.01,
                  ]}
                >
                  <boxGeometry args={[0.8, 1.2, 0.02]} />
                  <meshStandardMaterial
                    color="#ffeeaa"
                    emissive="#ffeeaa"
                    emissiveIntensity={1.5}
                  />
                </mesh>
              ) : null
            )
          )}
        </group>
      ))}

      {/* Trees alongside road */}
      {TREE_POSITIONS.map(x =>
        TREE_Z_OFFSETS.map(z => (
          <group key={`tree-${x}-${z}`} position={[x > 0 ? 14 : -14, 0, z]}>
            {/* Trunk */}
            <mesh position={[0, 1, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 2, 6]} />
              <meshStandardMaterial color="#5c3317" roughness={0.95} />
            </mesh>
            {/* Foliage */}
            <mesh position={[0, 3.2, 0]}>
              <coneGeometry args={[1.2, 3.5, 7]} />
              <meshStandardMaterial color={isNight ? '#0a2a0a' : '#2d5a1b'} roughness={0.8} />
            </mesh>
            <mesh position={[0, 2.2, 0]}>
              <coneGeometry args={[1.5, 2.5, 7]} />
              <meshStandardMaterial color={isNight ? '#0d300d' : '#347a20'} roughness={0.8} />
            </mesh>
          </group>
        ))
      )}

      {/* Fog */}
      <fog attach="fog" args={isNight ? ['#050510', 60, 220] : ['#c8d8f0', 100, 350]} />
    </>
  );
}

'use client';
import { useRef } from 'react';
import { Mesh } from 'three';
import { Sky, Stars } from '@react-three/drei';

interface Props { isNight: boolean }

const BUILDINGS = [
  { x: 22,  z: -80,  w: 9,  h: 28, d: 11, c: '#2a3344' },
  { x: 32,  z: -40,  w: 7,  h: 42, d: 9,  c: '#1e2a38' },
  { x: 24,  z: 20,   w: 11, h: 18, d: 13, c: '#2e3d4e' },
  { x: 38,  z: -110, w: 8,  h: 35, d: 10, c: '#1a2433' },
  { x: -22, z: -70,  w: 9,  h: 32, d: 11, c: '#28223a' },
  { x: -34, z: -25,  w: 7,  h: 22, d: 9,  c: '#1e1a2e' },
  { x: -26, z: 35,   w: 11, h: 48, d: 13, c: '#24203a' },
  { x: -40, z: -100, w: 8,  h: 26, d: 10, c: '#1a2028' },
  { x: 45,  z: 50,   w: 10, h: 20, d: 12, c: '#223344' },
  { x: -45, z: 60,   w: 10, h: 16, d: 12, c: '#22283a' },
  { x: 28,  z: -160, w: 14, h: 55, d: 14, c: '#1e2d3a' },
  { x: -30, z: -150, w: 14, h: 38, d: 14, c: '#1e2038' },
];

const MOUNTAINS = [
  { x: 80,  z: -200, w: 120, h: 55, d: 60, c: '#2a3545' },
  { x: -90, z: -220, w: 140, h: 70, d: 70, c: '#243040' },
  { x: 120, z: -350, w: 180, h: 90, d: 80, c: '#1e2a35' },
  { x: -130,z: -380, w: 200, h: 80, d: 90, c: '#1a2530' },
  { x: 60,  z: -500, w: 250, h: 100,d: 100,c: '#182028' },
  { x: -70, z: -480, w: 230, h: 110,d: 110,c: '#1a2030' },
];

const TREE_ROWS = [-1, 1] as const;
const TREE_Z = [-20, 0, 20, 45, 70, 100, 130, 160, 190, 220];

export function Environment({ isNight }: Props) {
  const groundRef = useRef<Mesh>(null);

  return (
    <>
      {/* Sky / Atmosphere */}
      {isNight ? (
        <>
          <color attach="background" args={['#03040e']} />
          <fog attach="fog" args={['#08091a', 80, 280]} />
          <Stars radius={300} depth={60} count={5000} factor={5} saturation={0.1} fade speed={0.3} />
          <ambientLight intensity={0.08} color="#1828aa" />
          <directionalLight
            position={[-20, 35, 15]}
            intensity={0.18}
            color="#3355bb"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={220}
            shadow-camera-left={-60}
            shadow-camera-right={60}
            shadow-camera-top={60}
            shadow-camera-bottom={-60}
          />
          {/* Moon glow */}
          <pointLight position={[-80, 120, -200]} intensity={0.5} color="#8899ff" distance={600} />
        </>
      ) : (
        <>
          <color attach="background" args={['#b8cfe8']} />
          <fog attach="fog" args={['#c8daf0', 120, 420]} />
          <Sky
            sunPosition={[80, 40, -120]}
            turbidity={6}
            rayleigh={0.6}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
            azimuth={195}
          />
          <ambientLight intensity={0.55} color="#ffe4c8" />
          <directionalLight
            position={[25, 55, -45]}
            intensity={2.2}
            color="#fff5e8"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={220}
            shadow-camera-left={-60}
            shadow-camera-right={60}
            shadow-camera-top={60}
            shadow-camera-bottom={-60}
          />
          <hemisphereLight args={['#88aaff', '#7a6040', 0.45]} />
        </>
      )}

      {/* === GROUND === */}
      {/* Main terrain */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, -100]} receiveShadow>
        <planeGeometry args={[400, 1200]} />
        <meshStandardMaterial
          color={isNight ? '#0c140c' : '#3a5e28'}
          roughness={0.98}
          metalness={0}
        />
      </mesh>
      {/* Road shoulder grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[18, -0.06, -100]}>
        <planeGeometry args={[12, 1200]} />
        <meshStandardMaterial color={isNight ? '#0e180e' : '#4a7032'} roughness={0.98} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-18, -0.06, -100]}>
        <planeGeometry args={[12, 1200]} />
        <meshStandardMaterial color={isNight ? '#0e180e' : '#4a7032'} roughness={0.98} />
      </mesh>

      {/* === MOUNTAINS (distant) === */}
      {MOUNTAINS.map((m, i) => (
        <group key={i} position={[m.x, 0, m.z]}>
          {/* Base triangle (cone) */}
          <mesh position={[0, m.h * 0.5, 0]}>
            <coneGeometry args={[m.w * 0.5, m.h, 6, 1]} />
            <meshStandardMaterial
              color={m.c}
              roughness={0.92}
              metalness={0.05}
            />
          </mesh>
          {/* Snow cap */}
          <mesh position={[0, m.h * 0.82, 0]}>
            <coneGeometry args={[m.w * 0.12, m.h * 0.22, 6, 1]} />
            <meshStandardMaterial
              color={isNight ? '#c8d4e0' : '#e8eef4'}
              roughness={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* === BUILDINGS === */}
      {BUILDINGS.map((b, i) => (
        <group key={i} position={[b.x, 0, b.z]}>
          <mesh position={[0, b.h / 2, 0]} castShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              color={b.c}
              roughness={0.6}
              metalness={0.25}
              emissive={b.c}
              emissiveIntensity={isNight ? 0.08 : 0}
            />
          </mesh>
          {/* Roof trim */}
          <mesh position={[0, b.h + 0.15, 0]}>
            <boxGeometry args={[b.w + 0.3, 0.3, b.d + 0.3]} />
            <meshStandardMaterial color={isNight ? '#334' : '#445'} metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Windows */}
          {isNight && Array.from({ length: Math.floor(b.h / 5) }).map((_, row) =>
            Array.from({ length: Math.floor(b.w / 3) }).map((_, col) =>
              Math.random() > 0.25 ? (
                <mesh key={`${row}-${col}`}
                  position={[-b.w / 2 + 1.5 + col * 3, 2.5 + row * 5, b.d / 2 + 0.01]}>
                  <boxGeometry args={[0.9, 1.4, 0.02]} />
                  <meshStandardMaterial
                    color="#ffeeaa"
                    emissive="#ffdd88"
                    emissiveIntensity={2.0}
                  />
                </mesh>
              ) : null
            )
          )}
        </group>
      ))}

      {/* === TREES === */}
      {TREE_ROWS.map(side =>
        TREE_Z.map(z => {
          const xBase = side * 14.5;
          return (
            <group key={`tree-${side}-${z}`} position={[xBase, 0, z]}>
              <mesh position={[0, 1.2, 0]} castShadow>
                <cylinderGeometry args={[0.18, 0.25, 2.4, 7]} />
                <meshStandardMaterial color={isNight ? '#2a1a08' : '#5c3a18'} roughness={0.98} />
              </mesh>
              <mesh position={[0, 4.0, 0]} castShadow>
                <coneGeometry args={[1.4, 4.0, 8]} />
                <meshStandardMaterial
                  color={isNight ? '#061206' : '#2a5c18'}
                  roughness={0.85}
                  metalness={0}
                />
              </mesh>
              <mesh position={[0, 2.8, 0]}>
                <coneGeometry args={[1.7, 2.8, 8]} />
                <meshStandardMaterial
                  color={isNight ? '#081808' : '#347a20'}
                  roughness={0.85}
                />
              </mesh>
            </group>
          );
        })
      )}

      {/* Guardrail concrete base */}
      <mesh position={[9.2, 0.04, -100]}>
        <boxGeometry args={[0.5, 0.08, 1200]} />
        <meshStandardMaterial color={isNight ? '#1e1e1e' : '#888'} roughness={0.9} />
      </mesh>
      <mesh position={[-9.2, 0.04, -100]}>
        <boxGeometry args={[0.5, 0.08, 1200]} />
        <meshStandardMaterial color={isNight ? '#1e1e1e' : '#888'} roughness={0.9} />
      </mesh>
    </>
  );
}

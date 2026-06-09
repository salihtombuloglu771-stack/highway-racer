'use client';
import { useRef } from 'react';
import { Mesh } from 'three';
import { Sky, Stars } from '@react-three/drei';

interface Props { isNight: boolean }

// Distant mountains — kept but pushed further back
const MOUNTAINS = [
  { x:  90, z: -280, w: 130, h: 60,  d: 65,  c: '#2a3545' },
  { x: -100,z: -310, w: 150, h: 78,  d: 75,  c: '#243040' },
  { x:  140, z: -440, w: 200, h: 95,  d: 85,  c: '#1e2a35' },
  { x: -150,z: -470, w: 220, h: 88,  d: 95,  c: '#1a2530' },
  { x:  70,  z: -580, w: 260, h: 108, d: 110, c: '#182028' },
  { x: -80,  z: -560, w: 240, h: 116, d: 115, c: '#1a2030' },
];

// Trees — sparser, further from the wider road (edge at 8.4 + shoulder ~2.2 = 10.6)
const TREE_SIDES = [-1, 1] as const;
const TREE_Z     = [-40, 15, 65, 120, 185, 255, 340];

export function Environment({ isNight }: Props) {
  const groundRef = useRef<Mesh>(null);

  return (
    <>
      {/* ── SKY / ATMOSPHERE ─────────────────────────────────── */}
      {isNight ? (
        <>
          <color attach="background" args={['#030410']} />
          <fog attach="fog" args={['#08091a', 90, 320]} />
          <Stars radius={300} depth={60} count={6000} factor={5} saturation={0.1} fade speed={0.3} />
          <ambientLight intensity={0.07} color="#1828aa" />
          <directionalLight
            position={[-20, 35, 15]}
            intensity={0.16}
            color="#3355bb"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={240}
            shadow-camera-left={-70}
            shadow-camera-right={70}
            shadow-camera-top={70}
            shadow-camera-bottom={-70}
          />
          <pointLight position={[-80, 120, -200]} intensity={0.5} color="#8899ff" distance={600} />
        </>
      ) : (
        <>
          <color attach="background" args={['#bdd4ee']} />
          <fog attach="fog" args={['#cce0f5', 140, 480]} />
          <Sky
            sunPosition={[80, 42, -120]}
            turbidity={5}
            rayleigh={0.55}
            mieCoefficient={0.004}
            mieDirectionalG={0.82}
            azimuth={195}
          />
          <ambientLight intensity={0.58} color="#ffe8cc" />
          <directionalLight
            position={[25, 55, -45]}
            intensity={2.4}
            color="#fff6e8"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={240}
            shadow-camera-left={-70}
            shadow-camera-right={70}
            shadow-camera-top={70}
            shadow-camera-bottom={-70}
          />
          <hemisphereLight args={['#88aaff', '#7a6040', 0.42]} />
        </>
      )}

      {/* ── GROUND ────────────────────────────────────────────── */}
      {/* Main terrain — open countryside */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, -150]} receiveShadow>
        <planeGeometry args={[600, 1400]} />
        <meshStandardMaterial
          color={isNight ? '#0b130b' : '#4a6e2e'}
          roughness={0.97}
          metalness={0}
        />
      </mesh>

      {/* Near shoulder grass strips (just outside road) */}
      {([1, -1] as const).map(s => (
        <mesh key={s} rotation={[-Math.PI / 2, 0, 0]} position={[s * 12.5, -0.06, -150]}>
          <planeGeometry args={[8, 1400]} />
          <meshStandardMaterial color={isNight ? '#0d160d' : '#56802e'} roughness={0.97} />
        </mesh>
      ))}

      {/* Far field strips (darker tone variation) */}
      {([1, -1] as const).map(s => (
        <mesh key={s} rotation={[-Math.PI / 2, 0, 0]} position={[s * 60, -0.06, -150]}>
          <planeGeometry args={[60, 1400]} />
          <meshStandardMaterial color={isNight ? '#0a120a' : '#3d5c22'} roughness={0.97} />
        </mesh>
      ))}

      {/* ── MOUNTAINS ─────────────────────────────────────────── */}
      {MOUNTAINS.map((m, i) => (
        <group key={i} position={[m.x, 0, m.z]}>
          <mesh position={[0, m.h * 0.5, 0]}>
            <coneGeometry args={[m.w * 0.5, m.h, 7, 1]} />
            <meshStandardMaterial color={m.c} roughness={0.92} metalness={0.04} />
          </mesh>
          {/* Snow cap */}
          <mesh position={[0, m.h * 0.83, 0]}>
            <coneGeometry args={[m.w * 0.11, m.h * 0.21, 7, 1]} />
            <meshStandardMaterial color={isNight ? '#c8d4e0' : '#eaeff6'} roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* ── TREES (sparse, outside shoulder) ─────────────────── */}
      {TREE_SIDES.map(side =>
        TREE_Z.map(z => {
          const xBase = side * 16;
          return (
            <group key={`tree-${side}-${z}`} position={[xBase, 0, z]}>
              {/* Trunk */}
              <mesh position={[0, 1.3, 0]} castShadow>
                <cylinderGeometry args={[0.19, 0.27, 2.6, 7]} />
                <meshStandardMaterial color={isNight ? '#2a1a08' : '#5c3a18'} roughness={0.98} />
              </mesh>
              {/* Lower cone */}
              <mesh position={[0, 3.0, 0]} castShadow>
                <coneGeometry args={[1.8, 2.9, 8]} />
                <meshStandardMaterial
                  color={isNight ? '#081808' : '#357a20'}
                  roughness={0.85}
                />
              </mesh>
              {/* Upper cone */}
              <mesh position={[0, 4.6, 0]} castShadow>
                <coneGeometry args={[1.3, 3.4, 8]} />
                <meshStandardMaterial
                  color={isNight ? '#061206' : '#2a5c18'}
                  roughness={0.85}
                />
              </mesh>
            </group>
          );
        })
      )}

      {/* ── KILOMETRE POSTS every ~80 units ─────────────────── */}
      {Array.from({ length: 12 }).map((_, i) => {
        const z = -(i * 80 + 40);
        return ([1, -1] as const).map(s => (
          <group key={`km-${i}-${s}`} position={[s * 11.2, 0, z]}>
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[0.12, 1.2, 0.12]} />
              <meshStandardMaterial color={isNight ? '#555' : '#888'} roughness={0.9} />
            </mesh>
            <mesh position={[0, 1.35, 0]}>
              <boxGeometry args={[0.32, 0.26, 0.08]} />
              <meshStandardMaterial
                color={isNight ? '#223' : '#1a3a6a'}
                emissive={isNight ? '#223' : '#000'}
                emissiveIntensity={isNight ? 0.2 : 0}
              />
            </mesh>
          </group>
        ));
      })}
    </>
  );
}

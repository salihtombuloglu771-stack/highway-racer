'use client';
import { forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { CarBrand } from '@/store/gameStore';
import { useGameStore } from '@/store/gameStore';

interface Props { color?: string; isNight?: boolean; brand?: CarBrand; }

// ── WHEEL SPINNER ─────────────────────────────────────────────────────────────
// Inner group — rotated around local-Y (which, after parent Rz(π/2), becomes world-X = axle)
const WheelSpin = forwardRef<Group, object>((_, ref) => (
  <group ref={ref}>
    {/* Tyre */}
    <mesh castShadow>
      <cylinderGeometry args={[0.36, 0.36, 0.26, 24]} />
      <meshStandardMaterial color="#111" roughness={0.92} metalness={0.02} />
    </mesh>
    {/* Tyre sidewall rim groove */}
    <mesh>
      <cylinderGeometry args={[0.25, 0.25, 0.27, 20]} />
      <meshStandardMaterial color="#1c1c1c" roughness={0.9} />
    </mesh>
    {/* Alloy rim face */}
    <mesh>
      <cylinderGeometry args={[0.24, 0.24, 0.268, 20]} />
      <meshStandardMaterial color="#d8d8d8" metalness={0.96} roughness={0.06} envMapIntensity={3.0} />
    </mesh>
    {/* 5 Y-spokes */}
    {[0, 1, 2, 3, 4].map(i => (
      <mesh key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
        <boxGeometry args={[0.04, 0.04, 0.46]} />
        <meshStandardMaterial color="#cccccc" metalness={0.95} roughness={0.07} envMapIntensity={2.2} />
      </mesh>
    ))}
    {/* Hub cap */}
    <mesh>
      <cylinderGeometry args={[0.07, 0.07, 0.27, 10]} />
      <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.3} />
    </mesh>
    {/* Centre bolt */}
    <mesh>
      <cylinderGeometry args={[0.028, 0.028, 0.29, 8]} />
      <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.2} />
    </mesh>
  </group>
));
WheelSpin.displayName = 'WheelSpin';

// Outer frame (orientation only — Rz(π/2) makes the axle sideways)
const Wheel = ({ pos, spinRef }: {
  pos: [number, number, number];
  spinRef: React.RefObject<Group | null>;
}) => (
  <group position={pos} rotation={[0, 0, Math.PI / 2]}>
    <WheelSpin ref={spinRef} />
  </group>
);

// ── BODY MATERIAL HELPERS ─────────────────────────────────────────────────────
// Physical material constants for automotive clearcoat paint
const BM = 0.08;  // metalness  (paint is barely metallic — clearcoat adds the gloss)
const BR = 0.12;  // roughness
const BI = 2.2;   // envMapIntensity
const CC = 1.0;   // clearcoat strength
const CR = 0.07;  // clearcoat roughness

/* ─── SHARED BASE BODY ───────────────────────────────────────────────────────── */
function BaseBody({ color, isNight, children }: { color: string; isNight: boolean; children?: React.ReactNode }) {
  return (
    <>
      {/* Underfloor */}
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[1.8, 0.1, 4.2]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>

      {/* Rocker sill — widest point, creates low stance */}
      <mesh position={[0, 0.21, 0]} castShadow>
        <boxGeometry args={[2.14, 0.26, 4.55]} />
        <meshPhysicalMaterial color={color} metalness={BM} roughness={BR} envMapIntensity={BI} clearcoat={CC} clearcoatRoughness={CR} />
      </mesh>

      {/* Main door panel */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[2.08, 0.44, 4.44]} />
        <meshPhysicalMaterial color={color} metalness={BM} roughness={BR} envMapIntensity={BI} clearcoat={CC} clearcoatRoughness={CR} />
      </mesh>

      {/* Beltline highlight — slightly shinier */}
      <mesh position={[0, 0.79, 0.08]} castShadow>
        <boxGeometry args={[2.0, 0.12, 4.32]} />
        <meshPhysicalMaterial color={color} metalness={BM + 0.05} roughness={BR - 0.04} envMapIntensity={BI * 1.3} clearcoat={CC} clearcoatRoughness={CR * 0.7} />
      </mesh>

      {/* Shoulder line — crease where sill narrows to door panel (light catcher) */}
      <mesh position={[0, 0.345, 0.1]}>
        <boxGeometry args={[2.13, 0.048, 4.48]} />
        <meshPhysicalMaterial color={color} metalness={BM + 0.08} roughness={BR - 0.06} envMapIntensity={BI * 1.8} clearcoat={CC} clearcoatRoughness={CR * 0.5} />
      </mesh>

      {/* Hood — 3-segment smooth curve */}
      <mesh position={[0, 0.77, 0.78]} rotation={[-0.02, 0, 0]} castShadow>
        <boxGeometry args={[1.98, 0.07, 1.4]} />
        <meshPhysicalMaterial color={color} metalness={BM + 0.05} roughness={BR - 0.04} envMapIntensity={BI * 1.4} clearcoat={CC} clearcoatRoughness={CR} />
      </mesh>
      <mesh position={[0, 0.71, 1.62]} rotation={[-0.26, 0, 0]} castShadow>
        <boxGeometry args={[1.96, 0.07, 0.65]} />
        <meshPhysicalMaterial color={color} metalness={BM + 0.03} roughness={BR - 0.02} envMapIntensity={BI * 1.2} clearcoat={CC} clearcoatRoughness={CR} />
      </mesh>
      <mesh position={[0, 0.61, 2.12]} rotation={[-0.56, 0, 0]} castShadow>
        <boxGeometry args={[1.94, 0.07, 0.72]} />
        <meshPhysicalMaterial color={color} metalness={BM} roughness={BR} envMapIntensity={BI} clearcoat={CC} clearcoatRoughness={CR} />
      </mesh>

      {/* Trunk — 3-segment smooth curve */}
      <mesh position={[0, 0.77, -1.48]} rotation={[0.03, 0, 0]} castShadow>
        <boxGeometry args={[1.92, 0.07, 1.18]} />
        <meshPhysicalMaterial color={color} metalness={BM + 0.04} roughness={BR - 0.03} envMapIntensity={BI * 1.3} clearcoat={CC} clearcoatRoughness={CR} />
      </mesh>
      <mesh position={[0, 0.7, -2.16]} rotation={[0.28, 0, 0]} castShadow>
        <boxGeometry args={[1.9, 0.07, 0.56]} />
        <meshPhysicalMaterial color={color} metalness={BM + 0.02} roughness={BR - 0.01} envMapIntensity={BI * 1.1} clearcoat={CC} clearcoatRoughness={CR} />
      </mesh>
      <mesh position={[0, 0.61, -2.36]} rotation={[0.52, 0, 0]} castShadow>
        <boxGeometry args={[1.9, 0.07, 0.52]} />
        <meshPhysicalMaterial color={color} metalness={BM} roughness={BR} envMapIntensity={BI} clearcoat={CC} clearcoatRoughness={CR} />
      </mesh>

      {/* Cabin lower / pillar area */}
      <mesh position={[0, 0.96, 0.06]} castShadow>
        <boxGeometry args={[1.92, 0.26, 2.52]} />
        <meshPhysicalMaterial color={color} metalness={BM} roughness={BR} envMapIntensity={BI} clearcoat={CC} clearcoatRoughness={CR} />
      </mesh>

      {/* Window chrome belt */}
      <mesh position={[0, 1.1, 0.04]}>
        <boxGeometry args={[1.84, 0.07, 2.38]} />
        <meshStandardMaterial color="#666" metalness={0.95} roughness={0.1} envMapIntensity={3.0} />
      </mesh>

      {/* Glass area — dark tinted */}
      <mesh position={[0, 1.3, 0.0]} castShadow>
        <boxGeometry args={[1.76, 0.4, 2.14]} />
        <meshStandardMaterial color="#090c16" roughness={0.05} metalness={0.1} envMapIntensity={2.5} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1.5, -0.06]} castShadow>
        <boxGeometry args={[1.62, 0.1, 1.9]} />
        <meshPhysicalMaterial color={color} metalness={BM + 0.05} roughness={BR - 0.04} envMapIntensity={BI * 1.5} clearcoat={CC} clearcoatRoughness={CR * 0.7} />
      </mesh>

      {/* Windshield — aggressive angle */}
      <mesh position={[0, 1.28, 1.1]} rotation={[-0.57, 0, 0]}>
        <boxGeometry args={[1.6, 0.72, 0.055]} />
        <meshStandardMaterial color="#7aa8c0" transparent opacity={0.38} metalness={0.95} roughness={0.02} envMapIntensity={3.5} />
      </mesh>

      {/* Rear glass */}
      <mesh position={[0, 1.24, -1.08]} rotation={[0.52, 0, 0]}>
        <boxGeometry args={[1.6, 0.62, 0.055]} />
        <meshStandardMaterial color="#7aa8c0" transparent opacity={0.32} metalness={0.95} roughness={0.02} envMapIntensity={2.5} />
      </mesh>

      {/* Side windows */}
      {([1, -1] as const).map(s => (
        <mesh key={s} position={[s * 0.88, 1.28, 0.04]}>
          <boxGeometry args={[0.04, 0.36, 1.68]} />
          <meshStandardMaterial color="#88b0cc" transparent opacity={0.3} metalness={0.9} roughness={0.02} envMapIntensity={2.0} />
        </mesh>
      ))}

      {/* Front bumper */}
      <mesh position={[0, 0.22, 2.31]}>
        <boxGeometry args={[2.14, 0.3, 0.16]} />
        <meshStandardMaterial color="#111" roughness={0.55} />
      </mesh>
      {/* Air dam */}
      <mesh position={[0, 0.09, 2.33]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[1.88, 0.13, 0.3]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
      </mesh>

      {/* Rear bumper */}
      <mesh position={[0, 0.22, -2.31]}>
        <boxGeometry args={[2.14, 0.3, 0.16]} />
        <meshStandardMaterial color="#111" roughness={0.55} />
      </mesh>
      {/* Diffuser */}
      <mesh position={[0, 0.1, -2.31]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[1.88, 0.12, 0.4]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
      </mesh>

      {/* Tail light bar */}
      <mesh position={[0, 0.62, -2.32]}>
        <boxGeometry args={[1.85, 0.06, 0.05]} />
        <meshStandardMaterial color="#ff1100" emissive="#ff1100" emissiveIntensity={isNight ? 7 : 2.5} />
      </mesh>

      {/* Exhaust tips */}
      {([0.58, -0.58] as const).map(x => (
        <group key={x}>
          <mesh position={[x, 0.18, -2.32]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.095, 0.095, 0.12, 10]} />
            <meshStandardMaterial color="#555" metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[x, 0.18, -2.31]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.062, 0.062, 0.14, 10]} />
            <meshStandardMaterial color="#111" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Wheel arch tori — curved fender arches over each wheel */}
      {([1.38, -1.38] as const).map(z => (
        <group key={z}>
          {([1, -1] as const).map(s => (
            <group key={s}>
              {/* Fender panel backing */}
              <mesh position={[s * 1.1, 0.38, z]} castShadow>
                <boxGeometry args={[0.15, 0.64, 0.88]} />
                <meshPhysicalMaterial color={color} metalness={BM} roughness={BR} envMapIntensity={BI * 1.1} clearcoat={CC} clearcoatRoughness={CR} />
              </mesh>
              {/* Arch torus ring */}
              <mesh position={[s * 1.06, 0.36, z]} rotation={[Math.PI / 2, -Math.PI / 2, 0]}>
                <torusGeometry args={[0.42, 0.058, 8, 24, Math.PI]} />
                <meshPhysicalMaterial color={color} metalness={BM + 0.05} roughness={BR - 0.04} envMapIntensity={BI * 1.5} clearcoat={CC} clearcoatRoughness={CR * 0.7} />
              </mesh>
              {/* Arch shadow groove */}
              <mesh position={[s * 1.055, 0.36, z]} rotation={[Math.PI / 2, -Math.PI / 2, 0]}>
                <torusGeometry args={[0.395, 0.018, 6, 18, Math.PI]} />
                <meshStandardMaterial color="#080808" roughness={0.95} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Door handles */}
      {([1, -1] as const).map(s => (
        <group key={s}>
          {[0.46, -0.44].map((z, i) => (
            <mesh key={i} position={[s * 1.05, 0.56, z]}>
              <boxGeometry args={[0.04, 0.055, 0.24]} />
              <meshStandardMaterial color="#888" metalness={0.88} roughness={0.14} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Side mirrors */}
      {([1, -1] as const).map(s => (
        <group key={s}>
          <mesh position={[s * 0.98, 0.88, 0.84]}>
            <boxGeometry args={[0.28, 0.12, 0.16]} />
            <meshPhysicalMaterial color={color} metalness={BM} roughness={BR} clearcoat={CC} clearcoatRoughness={CR} />
          </mesh>
          <mesh position={[s * 1.12, 0.88, 0.84]}>
            <boxGeometry args={[0.04, 0.1, 0.13]} />
            <meshStandardMaterial color="#223" metalness={0.98} roughness={0.02} envMapIntensity={3.5} />
          </mesh>
        </group>
      ))}

      {children}
    </>
  );
}

/* ─── BMW ─── */
function BMWFront({ isNight }: { isNight: boolean }) {
  const ei = isNight ? 5 : 2;
  return (
    <>
      {/* BMW twin kidney grilles */}
      {([0.38, -0.38] as const).map(x => (
        <group key={x}>
          <mesh position={[x, 0.44, 2.29]}>
            <boxGeometry args={[0.5, 0.34, 0.09]} />
            <meshStandardMaterial color="#050505" roughness={0.9} />
          </mesh>
          <mesh position={[x, 0.44, 2.31]}>
            <boxGeometry args={[0.46, 0.3, 0.06]} />
            <meshStandardMaterial color="#111" metalness={0.35} roughness={0.85} />
          </mesh>
          {[-0.08, 0, 0.08].map((y, i) => (
            <mesh key={i} position={[x, 0.44 + y, 2.33]}>
              <boxGeometry args={[0.44, 0.025, 0.04]} />
              <meshStandardMaterial color="#333" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Bridge */}
      <mesh position={[0, 0.44, 2.3]}>
        <boxGeometry args={[0.1, 0.34, 0.07]} />
        <meshStandardMaterial color="#111" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Headlights + angel-eye DRL */}
      {([0.75, -0.75] as const).map(x => (
        <group key={x}>
          <mesh position={[x, 0.52, 2.28]}>
            <boxGeometry args={[0.46, 0.2, 0.07]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={ei} />
          </mesh>
          <mesh position={[x, 0.4, 2.3]}>
            <boxGeometry args={[0.46, 0.038, 0.05]} />
            <meshStandardMaterial color="#b8d8ff" emissive="#b8d8ff" emissiveIntensity={3.5} />
          </mesh>
          <mesh position={[x > 0 ? x + 0.21 : x - 0.21, 0.46, 2.3]}>
            <boxGeometry args={[0.038, 0.16, 0.05]} />
            <meshStandardMaterial color="#b8d8ff" emissive="#b8d8ff" emissiveIntensity={3.5} />
          </mesh>
        </group>
      ))}

      {/* BMW roundel */}
      <mesh position={[0, 0.78, 1.52]}>
        <cylinderGeometry args={[0.095, 0.095, 0.016, 16]} />
        <meshStandardMaterial color="#1c69d4" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Taillights */}
      {([0.72, -0.72] as const).map(x => (
        <mesh key={x} position={[x, 0.52, -2.29]}>
          <boxGeometry args={[0.44, 0.22, 0.06]} />
          <meshStandardMaterial color="#cc0000" emissive="#cc0000" emissiveIntensity={isNight ? 5 : 2.5} />
        </mesh>
      ))}
      {/* Spoiler */}
      <mesh position={[0, 1.07, -2.22]}>
        <boxGeometry args={[1.72, 0.06, 0.36]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.45} metalness={0.55} />
      </mesh>
    </>
  );
}

/* ─── MERCEDES ─── */
function MercedesFront({ isNight }: { isNight: boolean }) {
  const ei = isNight ? 5 : 2;
  return (
    <>
      {/* Wide AMG grille */}
      <mesh position={[0, 0.44, 2.28]}>
        <boxGeometry args={[1.58, 0.34, 0.1]} />
        <meshStandardMaterial color="#060606" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.44, 2.31]}>
        <boxGeometry args={[1.61, 0.37, 0.06]} />
        <meshStandardMaterial color="#555" metalness={0.85} roughness={0.2} />
      </mesh>
      {[-0.1, 0, 0.1].map((y, i) => (
        <mesh key={i} position={[0, 0.44 + y, 2.32]}>
          <boxGeometry args={[1.55, 0.03, 0.04]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.15} />
        </mesh>
      ))}
      {/* Star */}
      <mesh position={[0, 0.44, 2.33]}>
        <boxGeometry args={[0.1, 0.026, 0.05]} />
        <meshStandardMaterial color="#ccc" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.44, 2.33]}>
        <boxGeometry args={[0.026, 0.1, 0.05]} />
        <meshStandardMaterial color="#ccc" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Headlights */}
      {([0.74, -0.74] as const).map(x => (
        <group key={x}>
          <mesh position={[x, 0.54, 2.27]}>
            <boxGeometry args={[0.5, 0.14, 0.07]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={ei} />
          </mesh>
          {[0, 0.055, 0.11].map((dy, i) => (
            <mesh key={i} position={[x, 0.4 + dy, 2.3]}>
              <boxGeometry args={[0.48, 0.028, 0.04]} />
              <meshStandardMaterial color="#cce0ff" emissive="#cce0ff" emissiveIntensity={2.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Hood ornament */}
      <mesh position={[0, 0.78, 2.1]}>
        <cylinderGeometry args={[0.055, 0.055, 0.05, 12]} />
        <meshStandardMaterial color="#ccc" metalness={0.95} roughness={0.08} />
      </mesh>

      {/* Taillights */}
      {([0.66, -0.66] as const).map(x => (
        <mesh key={x} position={[x, 0.54, -2.3]}>
          <boxGeometry args={[0.5, 0.16, 0.06]} />
          <meshStandardMaterial color="#cc0000" emissive="#cc0000" emissiveIntensity={isNight ? 5 : 2.5} />
        </mesh>
      ))}
      <mesh position={[0, 1.09, -2.22]}>
        <boxGeometry args={[1.76, 0.055, 0.4]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.38} metalness={0.65} />
      </mesh>
    </>
  );
}

/* ─── AUDI ─── */
function AudiFront({ isNight }: { isNight: boolean }) {
  const ei = isNight ? 5 : 2;
  return (
    <>
      {/* Singleframe grille */}
      <mesh position={[0, 0.42, 2.27]}>
        <boxGeometry args={[1.62, 0.44, 0.11]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.42, 2.3]}>
        <boxGeometry args={[1.65, 0.47, 0.06]} />
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </mesh>
      {[-3, -1, 1, 3].map(n => (
        <mesh key={n} position={[n * 0.18, 0.42, 2.32]}>
          <boxGeometry args={[0.028, 0.42, 0.04]} />
          <meshStandardMaterial color="#333" metalness={0.5} />
        </mesh>
      ))}

      {/* Full-width LED strip */}
      <mesh position={[0, 0.67, 2.3]}>
        <boxGeometry args={[1.72, 0.044, 0.05]} />
        <meshStandardMaterial color="#cce8ff" emissive="#cce8ff" emissiveIntensity={4.0} />
      </mesh>

      {/* Matrix headlights */}
      {([0.76, -0.76] as const).map(x => (
        <group key={x}>
          <mesh position={[x, 0.55, 2.27]}>
            <boxGeometry args={[0.44, 0.18, 0.07]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={ei} />
          </mesh>
          <mesh position={[x, 0.4, 2.3]}>
            <boxGeometry args={[0.44, 0.038, 0.05]} />
            <meshStandardMaterial color="#aaddff" emissive="#aaddff" emissiveIntensity={2.2} />
          </mesh>
        </group>
      ))}

      {/* Four rings */}
      {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.42, 2.33]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.058, 0.014, 8, 16]} />
          <meshStandardMaterial color="#ccc" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}

      {/* Full-width rear LED */}
      <mesh position={[0, 0.58, -2.32]}>
        <boxGeometry args={[1.82, 0.058, 0.05]} />
        <meshStandardMaterial color="#ff1100" emissive="#ff1100" emissiveIntensity={isNight ? 6 : 3} />
      </mesh>
      {([0.72, -0.72] as const).map(x => (
        <mesh key={x} position={[x, 0.5, -2.29]}>
          <boxGeometry args={[0.44, 0.18, 0.06]} />
          <meshStandardMaterial color="#aa0000" emissive="#aa0000" emissiveIntensity={isNight ? 4 : 2} />
        </mesh>
      ))}
      <mesh position={[0, 1.08, -2.24]}>
        <boxGeometry args={[1.74, 0.06, 0.38]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.28} metalness={0.72} />
      </mesh>
    </>
  );
}

/* ─── TOFAŞ ─── */
function TofasFront({ isNight }: { isNight: boolean }) {
  const ei = isNight ? 3 : 1;
  return (
    <>
      {/* Chrome front bumper */}
      <mesh position={[0, 0.28, 2.28]}>
        <boxGeometry args={[2.14, 0.38, 0.2]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.92} roughness={0.18} envMapIntensity={2.5} />
      </mesh>
      <mesh position={[0, 0.1, 2.27]}>
        <boxGeometry args={[2.02, 0.14, 0.16]} />
        <meshStandardMaterial color="#222" roughness={0.7} />
      </mesh>

      {/* Vertical grille */}
      <mesh position={[0, 0.48, 2.24]}>
        <boxGeometry args={[0.92, 0.34, 0.1]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      {[-0.35, -0.17, 0, 0.17, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0.48, 2.26]}>
          <boxGeometry args={[0.038, 0.32, 0.06]} />
          <meshStandardMaterial color="#666" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* Round sealed-beam headlights */}
      {([0.74, -0.74] as const).map(x => (
        <group key={x}>
          <mesh position={[x, 0.52, 2.24]}>
            <cylinderGeometry args={[0.2, 0.2, 0.08, 16]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={ei} />
          </mesh>
          <mesh position={[x, 0.52, 2.24]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.026, 8, 16]} />
            <meshStandardMaterial color="#bbb" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[x, 0.31, 2.25]}>
            <cylinderGeometry args={[0.1, 0.1, 0.065, 12]} />
            <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.55} />
          </mesh>
        </group>
      ))}

      {/* Chrome rear bumper */}
      <mesh position={[0, 0.28, -2.28]}>
        <boxGeometry args={[2.14, 0.38, 0.2]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.92} roughness={0.18} envMapIntensity={2.5} />
      </mesh>
      {([0.7, -0.7] as const).map(x => (
        <group key={x}>
          <mesh position={[x, 0.52, -2.24]}>
            <cylinderGeometry args={[0.18, 0.18, 0.07, 14]} />
            <meshStandardMaterial color="#cc0000" emissive="#cc0000" emissiveIntensity={isNight ? 5 : 2} />
          </mesh>
          <mesh position={[x * 0.5, 0.52, -2.24]}>
            <cylinderGeometry args={[0.12, 0.12, 0.07, 12]} />
            <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.38, -2.33]}>
        <boxGeometry args={[0.62, 0.15, 0.04]} />
        <meshStandardMaterial color="#fffff0" emissive="#fffff0" emissiveIntensity={isNight ? 1.8 : 0.1} />
      </mesh>
      <mesh position={[0, 0.8, -2.22]}>
        <boxGeometry args={[1.82, 0.05, 0.16]} />
        <meshStandardMaterial color="#bbb" metalness={0.88} roughness={0.18} envMapIntensity={2.0} />
      </mesh>
    </>
  );
}

/* ─── Main export ─── */
export const PlayerCarMesh = forwardRef<Group, Props>(({ color = '#e11d48', isNight = false, brand = 'bmw' }, ref) => {
  // Wheel spin refs (inner WheelSpin groups)
  const spinFL = useRef<Group>(null);
  const spinFR = useRef<Group>(null);
  const spinRL = useRef<Group>(null);
  const spinRR = useRef<Group>(null);
  const accSpin = useRef(0);

  useFrame((_, dt) => {
    const kmh = useGameStore.getState().displaySpeed;
    // wheel circumference ≈ 2π × 0.36 ≈ 2.26 m
    accSpin.current += (kmh / 3.6) / (Math.PI * 0.72) * dt;
    const s = accSpin.current;
    for (const r of [spinFL, spinFR, spinRL, spinRR]) {
      if (r.current) r.current.rotation.y = s;
    }
  });

  return (
    <group ref={ref}>
      <BaseBody color={color} isNight={isNight}>
        {brand === 'bmw'      && <BMWFront isNight={isNight} />}
        {brand === 'mercedes' && <MercedesFront isNight={isNight} />}
        {brand === 'audi'     && <AudiFront isNight={isNight} />}
        {brand === 'tofas'    && <TofasFront isNight={isNight} />}
      </BaseBody>
      {/* Wheels rendered outside BaseBody so spinRefs can be passed */}
      <Wheel pos={[ 1.13, 0.36,  1.38]} spinRef={spinFL} />
      <Wheel pos={[-1.13, 0.36,  1.38]} spinRef={spinFR} />
      <Wheel pos={[ 1.13, 0.36, -1.38]} spinRef={spinRL} />
      <Wheel pos={[-1.13, 0.36, -1.38]} spinRef={spinRR} />
    </group>
  );
});

PlayerCarMesh.displayName = 'PlayerCarMesh';

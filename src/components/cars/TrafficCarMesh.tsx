'use client';
import { forwardRef } from 'react';
import { Group } from 'three';
import { TrafficType } from '@/utils/constants';

    interface Props { type: TrafficType; color: string; isNight?: boolean; }

// Clearcoat automotive paint — the single biggest realism upgrade
const PM = 0.06, PR = 0.14, PE = 2.2, PC = 0.85, PCR = 0.09;

// ── WHEELS ────────────────────────────────────────────────────────────────
const SW = ({ pos }: { pos: [number, number, number] }) => (
  <group position={pos} rotation={[0, 0, Math.PI / 2]}>
    <mesh castShadow>
      <cylinderGeometry args={[0.33, 0.33, 0.25, 20]} />
      <meshStandardMaterial color="#161616" roughness={0.95} />
    </mesh>
    <mesh>
      <cylinderGeometry args={[0.21, 0.21, 0.26, 14]} />
      <meshStandardMaterial color="#cbcbcb" metalness={0.92} roughness={0.07} envMapIntensity={2.5} />
    </mesh>
    {[0, 1, 2, 3, 4].map(i => (
      <mesh key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
        <boxGeometry args={[0.036, 0.036, 0.4]} />
        <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.1} />
      </mesh>
    ))}
    <mesh>
      <cylinderGeometry args={[0.052, 0.052, 0.27, 8]} />
      <meshStandardMaterial color="#222" metalness={0.85} roughness={0.3} />
    </mesh>
  </group>
);

const BW = ({ pos }: { pos: [number, number, number] }) => (
  <group position={pos} rotation={[0, 0, Math.PI / 2]}>
    <mesh castShadow>
      <cylinderGeometry args={[0.42, 0.42, 0.38, 20]} />
      <meshStandardMaterial color="#161616" roughness={0.95} />
    </mesh>
    <mesh>
      <cylinderGeometry args={[0.28, 0.28, 0.39, 14]} />
      <meshStandardMaterial color="#b5b5b5" metalness={0.88} roughness={0.14} envMapIntensity={2.0} />
    </mesh>
    {[0, 1, 2, 3, 4, 5].map(i => (
      <mesh key={i} rotation={[0, (i * Math.PI * 2) / 6, 0]}>
        <boxGeometry args={[0.04, 0.04, 0.52]} />
        <meshStandardMaterial color="#aaa" metalness={0.85} roughness={0.15} />
      </mesh>
    ))}
    <mesh>
      <cylinderGeometry args={[0.068, 0.068, 0.4, 8]} />
      <meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} />
    </mesh>
  </group>
);

/* ── SEDAN ────────────────────────────────────────────────────────────────── */
function Sedan({ color, isNight }: { color: string; isNight: boolean }) {
  const li = isNight ? 3.5 : 1.0;
  return (
    <>
      {/* Underfloor */}
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[1.76, 0.1, 4.2]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      {/* Rocker sill */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[1.97, 0.22, 4.2]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR} envMapIntensity={PE} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Fender arches — curved torus arch on each side at each axle */}
      {([1.32, -1.32] as const).map(z => (
        <group key={z}>
          {([1, -1] as const).map(s => (
            <group key={s}>
              <mesh position={[s * 0.98, 0.3, z]} castShadow>
                <boxGeometry args={[0.14, 0.54, 0.88]} />
                <meshPhysicalMaterial color={color} metalness={PM} roughness={PR} envMapIntensity={PE} clearcoat={PC} clearcoatRoughness={PCR} />
              </mesh>
              <mesh position={[s * 0.96, 0.33, z]} rotation={[Math.PI / 2, -Math.PI / 2, 0]}>
                <torusGeometry args={[0.38, 0.048, 7, 18, Math.PI]} />
                <meshPhysicalMaterial color={color} metalness={PM + 0.05} roughness={PR - 0.04} envMapIntensity={PE * 1.4} clearcoat={PC} clearcoatRoughness={PCR * 0.7} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      {/* Door panel */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[1.91, 0.44, 4.1]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR} envMapIntensity={PE} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Beltline chrome strip */}
      <mesh position={[0, 0.76, 0]}>
        <boxGeometry args={[1.85, 0.065, 3.98]} />
        <meshStandardMaterial color="#888" metalness={0.92} roughness={0.1} envMapIntensity={2.5} />
      </mesh>
      {/* Hood flat */}
      <mesh position={[0, 0.73, 0.86]} rotation={[-0.04, 0, 0]} castShadow>
        <boxGeometry args={[1.82, 0.068, 1.48]} />
        <meshPhysicalMaterial color={color} metalness={PM + 0.05} roughness={PR - 0.04} envMapIntensity={PE * 1.3} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Hood slope */}
      <mesh position={[0, 0.6, 1.94]} rotation={[-0.44, 0, 0]} castShadow>
        <boxGeometry args={[1.78, 0.062, 0.7]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR} envMapIntensity={PE} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Trunk flat */}
      <mesh position={[0, 0.73, -1.52]} rotation={[0.05, 0, 0]} castShadow>
        <boxGeometry args={[1.8, 0.068, 1.28]} />
        <meshPhysicalMaterial color={color} metalness={PM + 0.04} roughness={PR - 0.03} envMapIntensity={PE * 1.2} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Trunk slope */}
      <mesh position={[0, 0.6, -2.18]} rotation={[0.42, 0, 0]} castShadow>
        <boxGeometry args={[1.76, 0.062, 0.54]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR} envMapIntensity={PE} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Cabin lower */}
      <mesh position={[0, 0.92, 0.06]} castShadow>
        <boxGeometry args={[1.78, 0.22, 2.32]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR} envMapIntensity={PE} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Window chrome belt */}
      <mesh position={[0, 1.06, 0.06]}>
        <boxGeometry args={[1.72, 0.065, 2.16]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.12} envMapIntensity={2.5} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 1.22, 0.04]} castShadow>
        <boxGeometry args={[1.66, 0.36, 2.0]} />
        <meshStandardMaterial color="#080c16" roughness={0.04} metalness={0.1} envMapIntensity={2.2} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.41, -0.04]} castShadow>
        <boxGeometry args={[1.52, 0.1, 1.76]} />
        <meshPhysicalMaterial color={color} metalness={PM + 0.06} roughness={PR - 0.05} envMapIntensity={PE * 1.4} clearcoat={PC} clearcoatRoughness={PCR * 0.65} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.22, 0.94]} rotation={[-0.52, 0, 0]}>
        <boxGeometry args={[1.48, 0.62, 0.05]} />
        <meshStandardMaterial color="#7ab0cc" transparent opacity={0.36} metalness={0.94} roughness={0.02} envMapIntensity={2.8} />
      </mesh>
      {/* Rear glass */}
      <mesh position={[0, 1.2, -1.0]} rotation={[0.48, 0, 0]}>
        <boxGeometry args={[1.48, 0.58, 0.05]} />
        <meshStandardMaterial color="#7ab0cc" transparent opacity={0.3} metalness={0.94} roughness={0.02} />
      </mesh>
      {/* Front bumper */}
      <mesh position={[0, 0.22, 2.13]}>
        <boxGeometry args={[1.95, 0.3, 0.16]} />
        <meshStandardMaterial color="#111" roughness={0.6} />
      </mesh>
      {/* Grille opening */}
      <mesh position={[0, 0.42, 2.13]}>
        <boxGeometry args={[1.1, 0.22, 0.12]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.85} />
      </mesh>
      {/* Headlight housings */}
      {([0.68, -0.68] as const).map(x => (
        <group key={x}>
          <mesh position={[x, 0.52, 2.08]}>
            <boxGeometry args={[0.52, 0.26, 0.16]} />
            <meshPhysicalMaterial color="#0a0a12" metalness={0.1} roughness={0.45} clearcoat={0.5} clearcoatRoughness={0.1} />
          </mesh>
          <mesh position={[x, 0.52, 2.15]}>
            <boxGeometry args={[0.46, 0.18, 0.06]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={li} />
          </mesh>
          <mesh position={[x, 0.4, 2.16]}>
            <boxGeometry args={[0.44, 0.026, 0.04]} />
            <meshStandardMaterial color="#b0d0ff" emissive="#b0d0ff" emissiveIntensity={2.2} />
          </mesh>
          <mesh position={[x, 0.5, 2.18]}>
            <boxGeometry args={[0.5, 0.24, 0.04]} />
            <meshStandardMaterial color="#ddeeff" transparent opacity={0.2} metalness={0.98} roughness={0.02} envMapIntensity={3.5} />
          </mesh>
        </group>
      ))}
      {/* Rear bumper */}
      <mesh position={[0, 0.22, -2.13]}>
        <boxGeometry args={[1.95, 0.3, 0.16]} />
        <meshStandardMaterial color="#111" roughness={0.6} />
      </mesh>
      {/* Taillight housings */}
      {([0.68, -0.68] as const).map(x => (
        <group key={x}>
          <mesh position={[x, 0.52, -2.08]}>
            <boxGeometry args={[0.52, 0.26, 0.16]} />
            <meshPhysicalMaterial color="#0f0005" metalness={0.1} roughness={0.45} clearcoat={0.5} clearcoatRoughness={0.1} />
          </mesh>
          <mesh position={[x, 0.52, -2.15]}>
            <boxGeometry args={[0.46, 0.18, 0.06]} />
            <meshStandardMaterial color="#cc2200" emissive="#cc2200" emissiveIntensity={isNight ? 4 : 1.5} />
          </mesh>
          <mesh position={[x, 0.5, -2.18]}>
            <boxGeometry args={[0.5, 0.24, 0.04]} />
            <meshStandardMaterial color="#ff6644" transparent opacity={0.18} metalness={0.98} roughness={0.02} envMapIntensity={2.5} />
          </mesh>
        </group>
      ))}
      {/* Door handles */}
      {([0.95, -0.95] as const).map(x => (
        <group key={x}>
          {[0.52, -0.42].map((z, i) => (
            <mesh key={i} position={[x, 0.56, z]}>
              <boxGeometry args={[0.04, 0.052, 0.22]} />
              <meshStandardMaterial color="#888" metalness={0.88} roughness={0.14} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Exhaust tips */}
      {([0.48, -0.48] as const).map(x => (
        <mesh key={x} position={[x, 0.18, -2.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.1, 8]} />
          <meshStandardMaterial color="#555" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      <SW pos={[1.05, 0.33, 1.32]} />
      <SW pos={[-1.05, 0.33, 1.32]} />
      <SW pos={[1.05, 0.33, -1.32]} />
      <SW pos={[-1.05, 0.33, -1.32]} />
    </>
  );
}

/* ── SUV ──────────────────────────────────────────────────────────────────── */
function SUV({ color, isNight }: { color: string; isNight: boolean }) {
  const li = isNight ? 3.5 : 1.0;
  return (
    <>
      {/* Underfloor */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.88, 0.12, 4.45]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      {/* Lower plastic cladding */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[2.18, 0.26, 4.5]} />
        <meshStandardMaterial color="#222" roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Fender flares — plastic cladding + curved arch torus per side */}
      {([1.45, -1.45] as const).map(z => (
        <group key={z}>
          <mesh position={[0, 0.28, z]} castShadow>
            <boxGeometry args={[2.24, 0.34, 0.88]} />
            <meshStandardMaterial color="#1e1e1e" roughness={0.82} metalness={0.12} />
          </mesh>
          {([1, -1] as const).map(s => (
            <mesh key={s} position={[s * 1.04, 0.42, z]} rotation={[Math.PI / 2, -Math.PI / 2, 0]}>
              <torusGeometry args={[0.44, 0.054, 7, 18, Math.PI]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.72} metalness={0.2} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Door panel */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[2.06, 0.66, 4.34]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR} envMapIntensity={PE} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Beltline chrome strip */}
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[2.0, 0.065, 4.24]} />
        <meshStandardMaterial color="#777" metalness={0.92} roughness={0.1} envMapIntensity={2.5} />
      </mesh>
      {/* Hood */}
      <mesh position={[0, 1.06, 0.9]} rotation={[-0.03, 0, 0]} castShadow>
        <boxGeometry args={[1.98, 0.08, 1.62]} />
        <meshPhysicalMaterial color={color} metalness={PM + 0.05} roughness={PR - 0.05} envMapIntensity={PE * 1.3} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Hood slope */}
      <mesh position={[0, 0.92, 2.06]} rotation={[-0.38, 0, 0]} castShadow>
        <boxGeometry args={[1.94, 0.07, 0.72]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR} envMapIntensity={PE} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Tailgate */}
      <mesh position={[0, 1.04, -1.62]} rotation={[0.04, 0, 0]} castShadow>
        <boxGeometry args={[1.96, 0.08, 1.38]} />
        <meshPhysicalMaterial color={color} metalness={PM + 0.04} roughness={PR - 0.04} envMapIntensity={PE * 1.2} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 1.3, 0.1]} castShadow>
        <boxGeometry args={[1.94, 0.3, 2.82]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR} envMapIntensity={PE} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Window chrome belt */}
      <mesh position={[0, 1.46, 0.1]}>
        <boxGeometry args={[1.88, 0.065, 2.68]} />
        <meshStandardMaterial color="#777" metalness={0.9} roughness={0.12} envMapIntensity={2.5} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 1.6, 0.08]} castShadow>
        <boxGeometry args={[1.82, 0.42, 2.58]} />
        <meshStandardMaterial color="#080c16" roughness={0.04} metalness={0.1} envMapIntensity={2.2} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.82, 0.06]} castShadow>
        <boxGeometry args={[1.76, 0.1, 2.44]} />
        <meshPhysicalMaterial color={color} metalness={PM + 0.06} roughness={PR - 0.05} envMapIntensity={PE * 1.4} clearcoat={PC} clearcoatRoughness={PCR * 0.65} />
      </mesh>
      {/* Roof rails */}
      {([0.82, -0.82] as const).map(x => (
        <mesh key={x} position={[x, 1.88, 0.06]}>
          <boxGeometry args={[0.065, 0.065, 2.18]} />
          <meshStandardMaterial color="#555" metalness={0.88} roughness={0.2} />
        </mesh>
      ))}
      {/* Windshield */}
      <mesh position={[0, 1.56, 1.44]} rotation={[-0.38, 0, 0]}>
        <boxGeometry args={[1.7, 0.66, 0.055]} />
        <meshStandardMaterial color="#7ab0cc" transparent opacity={0.36} metalness={0.92} roughness={0.03} envMapIntensity={2.5} />
      </mesh>
      {/* Rear glass */}
      <mesh position={[0, 1.56, -1.44]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[1.7, 0.66, 0.055]} />
        <meshStandardMaterial color="#7ab0cc" transparent opacity={0.3} metalness={0.92} roughness={0.03} />
      </mesh>
      {/* Front bumper + skid plate */}
      <mesh position={[0, 0.28, 2.26]}>
        <boxGeometry args={[2.18, 0.42, 0.18]} />
        <meshStandardMaterial color="#111" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.09, 2.27]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[2.0, 0.1, 0.36]} />
        <meshStandardMaterial color="#333" roughness={0.8} metalness={0.3} />
      </mesh>
      {/* Headlight housings */}
      {([0.72, -0.72] as const).map(x => (
        <group key={x}>
          <mesh position={[x, 0.75, 2.22]}>
            <boxGeometry args={[0.56, 0.26, 0.16]} />
            <meshPhysicalMaterial color="#0a0a12" metalness={0.1} roughness={0.45} clearcoat={0.5} clearcoatRoughness={0.1} />
          </mesh>
          <mesh position={[x, 0.75, 2.28]}>
            <boxGeometry args={[0.5, 0.2, 0.06]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={li} />
          </mesh>
          <mesh position={[x, 0.6, 2.29]}>
            <boxGeometry args={[0.5, 0.028, 0.04]} />
            <meshStandardMaterial color="#b0d0ff" emissive="#b0d0ff" emissiveIntensity={2.4} />
          </mesh>
          <mesh position={[x, 0.73, 2.31]}>
            <boxGeometry args={[0.54, 0.24, 0.04]} />
            <meshStandardMaterial color="#ddeeff" transparent opacity={0.2} metalness={0.98} roughness={0.02} envMapIntensity={3.5} />
          </mesh>
        </group>
      ))}
      {/* Rear bumper */}
      <mesh position={[0, 0.28, -2.26]}>
        <boxGeometry args={[2.18, 0.42, 0.18]} />
        <meshStandardMaterial color="#111" roughness={0.65} />
      </mesh>
      {/* Taillight housings */}
      {([0.72, -0.72] as const).map(x => (
        <group key={x}>
          <mesh position={[x, 0.75, -2.22]}>
            <boxGeometry args={[0.56, 0.26, 0.16]} />
            <meshPhysicalMaterial color="#0f0005" metalness={0.1} roughness={0.45} clearcoat={0.5} clearcoatRoughness={0.1} />
          </mesh>
          <mesh position={[x, 0.75, -2.28]}>
            <boxGeometry args={[0.5, 0.2, 0.06]} />
            <meshStandardMaterial color="#cc2200" emissive="#cc2200" emissiveIntensity={isNight ? 4 : 1.5} />
          </mesh>
          <mesh position={[x, 0.73, -2.31]}>
            <boxGeometry args={[0.54, 0.24, 0.04]} />
            <meshStandardMaterial color="#ff6644" transparent opacity={0.18} metalness={0.98} roughness={0.02} envMapIntensity={2.5} />
          </mesh>
        </group>
      ))}
      {/* Door handles */}
      {([1.04, -1.04] as const).map(x => (
        <group key={x}>
          {[0.55, -0.42].map((z, i) => (
            <mesh key={i} position={[x, 0.75, z]}>
              <boxGeometry args={[0.04, 0.055, 0.24]} />
              <meshStandardMaterial color="#888" metalness={0.88} roughness={0.14} />
            </mesh>
          ))}
        </group>
      ))}
      <SW pos={[1.14, 0.42, 1.45]} />
      <SW pos={[-1.14, 0.42, 1.45]} />
      <SW pos={[1.14, 0.42, -1.45]} />
      <SW pos={[-1.14, 0.42, -1.45]} />
    </>
  );
}

/* ── TRUCK ────────────────────────────────────────────────────────────────── */
function Truck({ color, isNight }: { color: string; isNight: boolean }) {
  return (
    <>
      {/* CABIN */}
      <mesh position={[0, 0.68, 3.6]} castShadow>
        <boxGeometry args={[2.22, 1.28, 2.82]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR + 0.06} envMapIntensity={PE - 0.4} clearcoat={PC - 0.15} clearcoatRoughness={PCR + 0.02} />
      </mesh>
      {/* Cabin top */}
      <mesh position={[0, 1.4, 3.6]} castShadow>
        <boxGeometry args={[2.16, 0.28, 2.7]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR + 0.05} envMapIntensity={PE - 0.3} clearcoat={PC - 0.1} clearcoatRoughness={PCR} />
      </mesh>
      {/* Roof fairing */}
      <mesh position={[0, 1.7, 2.95]} rotation={[0.18, 0, 0]} castShadow>
        <boxGeometry args={[2.12, 0.24, 2.2]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR + 0.08} envMapIntensity={PE - 0.5} clearcoat={PC - 0.2} clearcoatRoughness={PCR + 0.04} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.18, 5.08]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[2.0, 0.82, 0.06]} />
        <meshStandardMaterial color="#7ab0cc" transparent opacity={0.45} metalness={0.9} roughness={0.04} envMapIntensity={2.5} />
      </mesh>
      {/* Side windows */}
      {([1.1, -1.1] as const).map(x => (
        <mesh key={x} position={[x, 1.18, 4.12]}>
          <boxGeometry args={[0.05, 0.64, 1.35]} />
          <meshStandardMaterial color="#7ab0cc" transparent opacity={0.4} metalness={0.9} roughness={0.04} />
        </mesh>
      ))}
      {/* Headlights */}
      {([0.78, -0.78] as const).map(x => (
        <group key={x}>
          <mesh position={[x, 0.72, 5.06]}>
            <boxGeometry args={[0.5, 0.22, 0.14]} />
            <meshPhysicalMaterial color="#0a0a12" metalness={0.1} roughness={0.4} clearcoat={0.5} clearcoatRoughness={0.1} />
          </mesh>
          <mesh position={[x, 0.72, 5.12]}>
            <boxGeometry args={[0.44, 0.16, 0.06]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={isNight ? 4 : 1.2} />
          </mesh>
          <mesh position={[x, 0.72, 5.15]}>
            <boxGeometry args={[0.48, 0.2, 0.04]} />
            <meshStandardMaterial color="#ddeeff" transparent opacity={0.2} metalness={0.98} roughness={0.02} envMapIntensity={3.0} />
          </mesh>
        </group>
      ))}
      {/* Chrome grille */}
      <mesh position={[0, 0.82, 5.06]}>
        <boxGeometry args={[1.8, 0.52, 0.14]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.85} />
      </mesh>
      {/* Chrome bumper */}
      <mesh position={[0, 0.28, 5.06]}>
        <boxGeometry args={[2.24, 0.38, 0.22]} />
        <meshStandardMaterial color="#aaa" metalness={0.92} roughness={0.14} envMapIntensity={2.0} />
      </mesh>
      {/* Air horn stacks */}
      {([0.62, -0.62] as const).map(x => (
        <mesh key={x} position={[x, 1.84, 3.8]}>
          <cylinderGeometry args={[0.062, 0.062, 0.55, 8]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {/* Exhaust stack */}
      <mesh position={[1.1, 1.65, 3.0]}>
        <cylinderGeometry args={[0.085, 0.085, 1.2, 8]} />
        <meshStandardMaterial color="#666" metalness={0.88} roughness={0.22} />
      </mesh>

      {/* TRAILER */}
      <mesh position={[0, 1.12, -1.6]} castShadow>
        <boxGeometry args={[2.28, 2.02, 7.2]} />
        <meshStandardMaterial color="#e2e2e2" metalness={0.35} roughness={0.62} />
      </mesh>
      {/* Trailer ribs */}
      {[-4.5, -3.4, -2.3, -1.2, -0.1, 1.0, 2.1, 3.2].map((z, i) => (
        <mesh key={i} position={[0, 0.62, z - 1.6]}>
          <boxGeometry args={[2.32, 0.065, 0.075]} />
          <meshStandardMaterial color="#c8c8c8" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* Trailer taillights */}
      {([0.98, -0.98] as const).map(x => (
        <group key={x}>
          <mesh position={[x, 0.74, -5.22]}>
            <boxGeometry args={[0.32, 0.22, 0.07]} />
            <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={isNight ? 3.5 : 1.5} />
          </mesh>
          <mesh position={[x, 0.52, -5.22]}>
            <boxGeometry args={[0.28, 0.16, 0.07]} />
            <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={isNight ? 2 : 0.8} />
          </mesh>
        </group>
      ))}
      {/* Big wheels */}
      <BW pos={[1.22, 0.42, 4.05]} />
      <BW pos={[-1.22, 0.42, 4.05]} />
      <BW pos={[1.22, 0.42, 2.15]} />
      <BW pos={[-1.22, 0.42, 2.15]} />
      <BW pos={[1.22, 0.42, -1.35]} />
      <BW pos={[-1.22, 0.42, -1.35]} />
      <BW pos={[1.22, 0.42, -2.9]} />
      <BW pos={[-1.22, 0.42, -2.9]} />
    </>
  );
}

/* ── BUS ──────────────────────────────────────────────────────────────────── */
function Bus({ color, isNight }: { color: string; isNight: boolean }) {
  return (
    <>
      {/* Main body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[2.3, 2.22, 8.5]} />
        <meshPhysicalMaterial color={color} metalness={PM + 0.02} roughness={PR + 0.08} envMapIntensity={PE - 0.5} clearcoat={PC - 0.2} clearcoatRoughness={PCR + 0.04} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 2.36, 0]} castShadow>
        <boxGeometry args={[2.26, 0.13, 8.38]} />
        <meshPhysicalMaterial color={color} metalness={PM + 0.04} roughness={PR + 0.05} envMapIntensity={PE - 0.3} clearcoat={PC - 0.1} clearcoatRoughness={PCR} />
      </mesh>
      {/* Side window strip */}
      {([1.18, -1.18] as const).map(x => (
        <mesh key={x} position={[x, 1.6, 0]}>
          <boxGeometry args={[0.055, 0.78, 7.2]} />
          <meshStandardMaterial color="#9cc0dd" transparent opacity={0.55} metalness={0.88} roughness={0.04} envMapIntensity={2.0} />
        </mesh>
      ))}
      {/* Window pillar frames */}
      {[-3.0, -1.8, -0.6, 0.6, 1.8, 3.0].map((z, i) => (
        <group key={i}>
          {([1.18, -1.18] as const).map(x => (
            <mesh key={x} position={[x, 1.6, z]}>
              <boxGeometry args={[0.065, 0.82, 0.11]} />
              <meshPhysicalMaterial color={color} metalness={PM + 0.02} roughness={PR + 0.05} envMapIntensity={PE - 0.4} clearcoat={PC - 0.15} clearcoatRoughness={PCR + 0.03} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Front windshield */}
      <mesh position={[0, 1.55, 4.28]}>
        <boxGeometry args={[2.12, 0.96, 0.06]} />
        <meshStandardMaterial color="#9cc0dd" transparent opacity={0.5} metalness={0.88} roughness={0.04} envMapIntensity={2.5} />
      </mesh>
      {/* Rear window */}
      <mesh position={[0, 1.55, -4.28]}>
        <boxGeometry args={[2.12, 0.92, 0.06]} />
        <meshStandardMaterial color="#9cc0dd" transparent opacity={0.45} metalness={0.88} roughness={0.04} />
      </mesh>
      {/* Front lower skirt */}
      <mesh position={[0, 0.3, 4.28]}>
        <boxGeometry args={[2.3, 0.5, 0.12]} />
        <meshStandardMaterial color="#111" roughness={0.7} />
      </mesh>
      {/* Headlights */}
      {([0.84, -0.84] as const).map(x => (
        <group key={x}>
          <mesh position={[x, 0.65, 4.28]}>
            <boxGeometry args={[0.56, 0.26, 0.14]} />
            <meshPhysicalMaterial color="#0a0a12" metalness={0.1} roughness={0.4} clearcoat={0.5} clearcoatRoughness={0.1} />
          </mesh>
          <mesh position={[x, 0.65, 4.34]}>
            <boxGeometry args={[0.5, 0.2, 0.06]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={isNight ? 3.5 : 0.9} />
          </mesh>
          <mesh position={[x, 0.65, 4.37]}>
            <boxGeometry args={[0.54, 0.24, 0.04]} />
            <meshStandardMaterial color="#ddeeff" transparent opacity={0.2} metalness={0.98} roughness={0.02} envMapIntensity={3.0} />
          </mesh>
        </group>
      ))}
      {/* Taillights */}
      {([0.84, -0.84] as const).map(x => (
        <group key={x}>
          <mesh position={[x, 0.65, -4.28]}>
            <boxGeometry args={[0.56, 0.26, 0.14]} />
            <meshPhysicalMaterial color="#0f0005" metalness={0.1} roughness={0.4} clearcoat={0.5} clearcoatRoughness={0.1} />
          </mesh>
          <mesh position={[x, 0.65, -4.34]}>
            <boxGeometry args={[0.5, 0.2, 0.06]} />
            <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={isNight ? 3.5 : 1.5} />
          </mesh>
          <mesh position={[x, 0.65, -4.37]}>
            <boxGeometry args={[0.54, 0.24, 0.04]} />
            <meshStandardMaterial color="#ff6644" transparent opacity={0.18} metalness={0.98} roughness={0.02} envMapIntensity={2.5} />
          </mesh>
        </group>
      ))}
      {/* Route number display */}
      <mesh position={[0, 2.14, 4.3]}>
        <boxGeometry args={[1.22, 0.38, 0.055]} />
        <meshStandardMaterial color="#ffdd00" emissive="#ffdd00" emissiveIntensity={isNight ? 2.5 : 0.8} />
      </mesh>
      {/* Rear destination */}
      <mesh position={[0, 2.14, -4.3]}>
        <boxGeometry args={[1.1, 0.32, 0.055]} />
        <meshStandardMaterial color="#ffdd00" emissive="#ffdd00" emissiveIntensity={isNight ? 2.0 : 0.6} />
      </mesh>
      {/* Door opening line */}
      <mesh position={[1.18, 1.0, 2.0]}>
        <boxGeometry args={[0.055, 1.55, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      <BW pos={[1.24, 0.42, 3.2]} />
      <BW pos={[-1.24, 0.42, 3.2]} />
      <BW pos={[1.24, 0.42, -3.2]} />
      <BW pos={[-1.24, 0.42, -3.2]} />
    </>
  );
}

/* ── SPORT CAR ────────────────────────────────────────────────────────────── */
function SportCar({ color, isNight }: { color: string; isNight: boolean }) {
  const li = isNight ? 4.5 : 1.5;
  return (
    <>
      {/* Underfloor */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.9, 0.1, 4.6]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      {/* Wide low sill */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[2.34, 0.22, 4.6]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR} envMapIntensity={PE} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Wide fender arches — side panels + torus arch per axle */}
      {([1.52, -1.52] as const).map(z => (
        <group key={z}>
          {([1, -1] as const).map(s => (
            <group key={s}>
              <mesh position={[s * 1.14, 0.28, z]} castShadow>
                <boxGeometry args={[0.16, 0.52, 0.9]} />
                <meshPhysicalMaterial color={color} metalness={PM} roughness={PR} envMapIntensity={PE} clearcoat={PC} clearcoatRoughness={PCR} />
              </mesh>
              <mesh position={[s * 1.12, 0.32, z]} rotation={[Math.PI / 2, -Math.PI / 2, 0]}>
                <torusGeometry args={[0.38, 0.052, 7, 20, Math.PI]} />
                <meshPhysicalMaterial color={color} metalness={PM + 0.06} roughness={PR - 0.05} envMapIntensity={PE * 1.5} clearcoat={PC} clearcoatRoughness={PCR * 0.65} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2.28, 0.44, 4.54]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR} envMapIntensity={PE} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Beltline */}
      <mesh position={[0, 0.74, 0.06]} castShadow>
        <boxGeometry args={[2.2, 0.1, 4.4]} />
        <meshPhysicalMaterial color={color} metalness={PM + 0.05} roughness={PR - 0.04} envMapIntensity={PE * 1.5} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Hood — very flat */}
      <mesh position={[0, 0.76, 0.88]} rotation={[-0.04, 0, 0]} castShadow>
        <boxGeometry args={[2.12, 0.065, 1.65]} />
        <meshPhysicalMaterial color={color} metalness={PM + 0.06} roughness={PR - 0.05} envMapIntensity={PE * 1.6} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Hood slope — aggressive */}
      <mesh position={[0, 0.61, 2.12]} rotation={[-0.52, 0, 0]} castShadow>
        <boxGeometry args={[2.08, 0.065, 0.82]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR} envMapIntensity={PE} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Fastback rear */}
      <mesh position={[0, 0.74, -1.45]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[2.14, 0.065, 1.28]} />
        <meshPhysicalMaterial color={color} metalness={PM + 0.05} roughness={PR - 0.04} envMapIntensity={PE * 1.4} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      <mesh position={[0, 0.6, -2.22]} rotation={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[2.1, 0.065, 0.68]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR} envMapIntensity={PE} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Cabin — fastback low */}
      <mesh position={[0, 0.92, 0.1]} castShadow>
        <boxGeometry args={[1.9, 0.2, 2.34]} />
        <meshPhysicalMaterial color={color} metalness={PM} roughness={PR} envMapIntensity={PE} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {/* Window belt chrome */}
      <mesh position={[0, 1.04, 0.1]}>
        <boxGeometry args={[1.84, 0.065, 2.18]} />
        <meshStandardMaterial color="#888" metalness={0.92} roughness={0.1} envMapIntensity={2.5} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 1.1, 0.08]} castShadow>
        <boxGeometry args={[1.8, 0.32, 2.1]} />
        <meshStandardMaterial color="#080c16" roughness={0.04} metalness={0.1} envMapIntensity={2.5} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.26, -0.04]} castShadow>
        <boxGeometry args={[1.57, 0.09, 1.74]} />
        <meshPhysicalMaterial color={color} metalness={PM + 0.07} roughness={PR - 0.05} envMapIntensity={PE * 1.7} clearcoat={PC} clearcoatRoughness={PCR * 0.65} />
      </mesh>
      {/* Windshield — aggressive angle */}
      <mesh position={[0, 1.12, 1.07]} rotation={[-0.62, 0, 0]}>
        <boxGeometry args={[1.64, 0.68, 0.05]} />
        <meshStandardMaterial color="#7ab0cc" transparent opacity={0.35} metalness={0.95} roughness={0.02} envMapIntensity={3.0} />
      </mesh>
      {/* Rear glass fastback */}
      <mesh position={[0, 1.0, -1.18]} rotation={[0.72, 0, 0]}>
        <boxGeometry args={[1.64, 0.74, 0.05]} />
        <meshStandardMaterial color="#7ab0cc" transparent opacity={0.3} metalness={0.95} roughness={0.02} />
      </mesh>
      {/* Front splitter */}
      <mesh position={[0, 0.09, 2.35]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[2.3, 0.06, 0.35]} />
        <meshStandardMaterial color="#111" roughness={0.65} metalness={0.25} />
      </mesh>
      {/* Full-width headlight strip */}
      <mesh position={[0, 0.5, 2.35]}>
        <boxGeometry args={[1.7, 0.12, 0.08]} />
        <meshPhysicalMaterial color="#0a0a12" metalness={0.1} roughness={0.4} clearcoat={0.5} clearcoatRoughness={0.1} />
      </mesh>
      <mesh position={[0, 0.5, 2.39]}>
        <boxGeometry args={[1.65, 0.1, 0.06]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={li} />
      </mesh>
      <mesh position={[0, 0.38, 2.4]}>
        <boxGeometry args={[1.72, 0.032, 0.04]} />
        <meshStandardMaterial color="#ccddff" emissive="#ccddff" emissiveIntensity={3.2} />
      </mesh>
      <mesh position={[0, 0.48, 2.42]}>
        <boxGeometry args={[1.72, 0.14, 0.04]} />
        <meshStandardMaterial color="#ddeeff" transparent opacity={0.2} metalness={0.98} roughness={0.02} envMapIntensity={3.5} />
      </mesh>
      {/* Full-width LED tail */}
      <mesh position={[0, 0.62, -2.36]}>
        <boxGeometry args={[2.04, 0.065, 0.065]} />
        <meshStandardMaterial color="#ff1100" emissive="#ff1100" emissiveIntensity={isNight ? 7 : 3} />
      </mesh>
      {/* Rear diffuser */}
      <mesh position={[0, 0.1, -2.36]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[2.24, 0.14, 0.46]} />
        <meshStandardMaterial color="#111" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Wing spoiler */}
      <mesh position={[0, 1.0, -2.26]}>
        <boxGeometry args={[2.24, 0.065, 0.46]} />
        <meshPhysicalMaterial color={color} metalness={PM + 0.05} roughness={PR - 0.03} envMapIntensity={PE * 1.5} clearcoat={PC} clearcoatRoughness={PCR} />
      </mesh>
      {([0.96, -0.96] as const).map(x => (
        <mesh key={x} position={[x, 0.9, -2.26]}>
          <boxGeometry args={[0.08, 0.24, 0.1]} />
          <meshStandardMaterial color="#111" roughness={0.5} />
        </mesh>
      ))}
      {/* Door handles */}
      {([1.16, -1.16] as const).map(x => (
        <mesh key={x} position={[x, 0.56, 0.14]}>
          <boxGeometry args={[0.04, 0.052, 0.22]} />
          <meshStandardMaterial color="#888" metalness={0.88} roughness={0.14} />
        </mesh>
      ))}
      {/* Exhaust tips */}
      {([0.72, -0.72] as const).map(x => (
        <mesh key={x} position={[x, 0.18, -2.37]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.12, 10]} />
          <meshStandardMaterial color="#555" metalness={0.9} roughness={0.18} />
        </mesh>
      ))}
      <SW pos={[1.2, 0.32, 1.52]} />
      <SW pos={[-1.2, 0.32, 1.52]} />
      <SW pos={[1.2, 0.32, -1.52]} />
      <SW pos={[-1.2, 0.32, -1.52]} />
    </>
  );
}

export const TrafficCarMesh = forwardRef<Group, Props>(({ type, color, isNight = false }, ref) => (
  <group ref={ref}>
    {type === 'sedan' && <Sedan color={color} isNight={isNight} />}
    {type === 'suv'   && <SUV   color={color} isNight={isNight} />}
    {type === 'truck' && <Truck color={color} isNight={isNight} />}
    {type === 'bus'   && <Bus   color={color} isNight={isNight} />}
    {type === 'sport' && <SportCar color={color} isNight={isNight} />}
  </group>
));

TrafficCarMesh.displayName = 'TrafficCarMesh';

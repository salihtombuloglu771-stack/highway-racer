'use client';
import { forwardRef } from 'react';
import { Group } from 'three';
import { CarBrand } from '@/store/gameStore';

interface Props { color?: string; isNight?: boolean; brand?: CarBrand; }

const Wheel = ({ pos, flip = false }: { pos: [number, number, number]; flip?: boolean }) => (
  <group position={pos} rotation={[0, flip ? Math.PI : 0, 0]}>
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.38, 0.38, 0.28, 24]} />
      <meshStandardMaterial color="#111" roughness={0.95} />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.25, 0.25, 0.29, 20]} />
      <meshStandardMaterial color="#c0c0c0" metalness={0.92} roughness={0.12} />
    </mesh>
    {[0, 1, 2, 3, 4].map(i => (
      <mesh key={i} rotation={[Math.PI / 2, (i * Math.PI * 2) / 5, 0]}>
        <boxGeometry args={[0.045, 0.46, 0.045]} />
        <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.15} />
      </mesh>
    ))}
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.07, 0.07, 0.3, 8]} />
      <meshStandardMaterial color="#333" metalness={0.8} />
    </mesh>
  </group>
);

/* ─── shared base body ─── */
function BaseBody({ color, isNight, children }: { color: string; isNight: boolean; children?: React.ReactNode }) {
  const m = 0.75; const r = 0.18;
  return (
    <>
      {/* Lower body */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[2.12, 0.62, 4.45]} />
        <meshStandardMaterial color={color} metalness={m} roughness={r} envMapIntensity={1.2} />
      </mesh>
      {/* Fender flares */}
      {[1, -1].map(s => [1.35, -1.5].map((z, zi) => (
        <mesh key={`ff-${s}-${zi}`} position={[s * 1.08, 0.44, z]} castShadow>
          <boxGeometry args={[0.12, 0.56, 1.05]} />
          <meshStandardMaterial color={color} metalness={m} roughness={r} />
        </mesh>
      )))}
      {/* Side skirts */}
      {[1, -1].map(s => (
        <mesh key={`sk-${s}`} position={[s * 1.05, 0.14, 0.05]}>
          <boxGeometry args={[0.06, 0.16, 3.35]} />
          <meshStandardMaterial color="#111" roughness={0.7} />
        </mesh>
      ))}
      {/* Hood top */}
      <mesh position={[0, 0.76, 1.18]} rotation={[-0.06, 0, 0]} castShadow>
        <boxGeometry args={[2.0, 0.06, 1.75]} />
        <meshStandardMaterial color={color} metalness={m + 0.05} roughness={r - 0.04} envMapIntensity={1.5} />
      </mesh>
      {/* Hood slope */}
      <mesh position={[0, 0.6, 2.1]} rotation={[-0.5, 0, 0]} castShadow>
        <boxGeometry args={[1.9, 0.06, 0.65]} />
        <meshStandardMaterial color={color} metalness={m} roughness={r} />
      </mesh>
      {/* Cabin lower */}
      <mesh position={[0, 0.96, 0.18]} castShadow>
        <boxGeometry args={[1.82, 0.22, 2.5]} />
        <meshStandardMaterial color={color} metalness={m} roughness={r} />
      </mesh>
      {/* Glass area */}
      <mesh position={[0, 1.32, 0.06]} castShadow>
        <boxGeometry args={[1.72, 0.5, 2.05]} />
        <meshStandardMaterial color="#0a0a14" roughness={0.05} metalness={0.1} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.6, -0.06]} castShadow>
        <boxGeometry args={[1.68, 0.1, 1.82]} />
        <meshStandardMaterial color={color} metalness={m + 0.05} roughness={r} envMapIntensity={1.5} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.3, 1.12]} rotation={[-0.45, 0, 0]}>
        <boxGeometry args={[1.58, 0.62, 0.05]} />
        <meshStandardMaterial color="#88bbdd" transparent opacity={0.42} metalness={0.95} roughness={0.0} envMapIntensity={2.0} />
      </mesh>
      {/* Rear glass */}
      <mesh position={[0, 1.26, -1.1]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[1.58, 0.55, 0.05]} />
        <meshStandardMaterial color="#88bbdd" transparent opacity={0.38} metalness={0.95} roughness={0.0} />
      </mesh>
      {/* Side windows */}
      {[1, -1].map(s => (
        <mesh key={`sw-${s}`} position={[s * 0.87, 1.32, 0.05]}>
          <boxGeometry args={[0.04, 0.42, 1.62]} />
          <meshStandardMaterial color="#99ccee" transparent opacity={0.35} metalness={0.9} roughness={0.0} />
        </mesh>
      ))}
      {/* Trunk lid */}
      <mesh position={[0, 0.76, -1.85]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[1.86, 0.07, 1.2]} />
        <meshStandardMaterial color={color} metalness={m} roughness={r} envMapIntensity={1.3} />
      </mesh>
      {/* Rear bumper */}
      <mesh position={[0, 0.22, -2.28]}>
        <boxGeometry args={[2.1, 0.28, 0.16]} />
        <meshStandardMaterial color="#111" roughness={0.6} />
      </mesh>
      {/* Rear diffuser */}
      <mesh position={[0, 0.1, -2.28]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[1.85, 0.1, 0.42]} />
        <meshStandardMaterial color="#111" roughness={0.7} />
      </mesh>
      {/* Tail light bar */}
      <mesh position={[0, 0.59, -2.27]}>
        <boxGeometry args={[1.82, 0.055, 0.05]} />
        <meshStandardMaterial color="#ff1100" emissive="#ff1100" emissiveIntensity={isNight ? 5 : 2} />
      </mesh>
      {/* Exhaust */}
      {[0.55, -0.55].map(x => (
        <group key={`ex-${x}`}>
          <mesh position={[x, 0.2, -2.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.12, 10]} />
            <meshStandardMaterial color="#444" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[x, 0.2, -2.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.15, 10]} />
            <meshStandardMaterial color="#111" roughness={0.9} />
          </mesh>
        </group>
      ))}
      {/* Side mirrors */}
      {[1, -1].map(s => (
        <group key={`mir-${s}`}>
          <mesh position={[s * 0.99, 0.9, 0.82]}>
            <boxGeometry args={[0.26, 0.12, 0.15]} />
            <meshStandardMaterial color={color} metalness={m} roughness={r} />
          </mesh>
          <mesh position={[s * 1.11, 0.9, 0.82]}>
            <boxGeometry args={[0.04, 0.1, 0.13]} />
            <meshStandardMaterial color="#334" metalness={0.98} roughness={0.0} envMapIntensity={2.0} />
          </mesh>
        </group>
      ))}
      {/* Undercarriage */}
      <mesh position={[0, 0.06, 0.1]}>
        <boxGeometry args={[1.62, 0.1, 4.05]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      {children}
      {/* Wheels */}
      <Wheel pos={[1.13, 0.38, 1.5]} />
      <Wheel pos={[-1.13, 0.38, 1.5]} flip />
      <Wheel pos={[1.13, 0.38, -1.5]} />
      <Wheel pos={[-1.13, 0.38, -1.5]} flip />
    </>
  );
}

/* ─── BMW front/rear ─── */
function BMWFront({ isNight }: { isNight: boolean }) {
  const ei = isNight ? 4 : 1.5;
  return (
    <>
      {/* Lower bumper */}
      <mesh position={[0, 0.22, 2.28]}>
        <boxGeometry args={[2.1, 0.28, 0.16]} />
        <meshStandardMaterial color="#111" roughness={0.6} />
      </mesh>
      {/* Front splitter */}
      <mesh position={[0, 0.08, 2.3]}>
        <boxGeometry args={[1.85, 0.06, 0.26]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
      {/* BMW Kidney grille left */}
      <mesh position={[0.38, 0.44, 2.25]}>
        <boxGeometry args={[0.5, 0.32, 0.08]} />
        <meshStandardMaterial color="#060606" roughness={0.9} />
      </mesh>
      <mesh position={[0.38, 0.44, 2.27]}>
        <boxGeometry args={[0.46, 0.28, 0.06]} />
        <meshStandardMaterial color="#111" metalness={0.4} roughness={0.8} />
      </mesh>
      {/* Kidney grille right */}
      <mesh position={[-0.38, 0.44, 2.25]}>
        <boxGeometry args={[0.5, 0.32, 0.08]} />
        <meshStandardMaterial color="#060606" roughness={0.9} />
      </mesh>
      <mesh position={[-0.38, 0.44, 2.27]}>
        <boxGeometry args={[0.46, 0.28, 0.06]} />
        <meshStandardMaterial color="#111" metalness={0.4} roughness={0.8} />
      </mesh>
      {/* Bridge between kidneys */}
      <mesh position={[0, 0.44, 2.26]}>
        <boxGeometry args={[0.1, 0.32, 0.07]} />
        <meshStandardMaterial color="#111" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Headlight housing L */}
      <mesh position={[0.72, 0.5, 2.25]}>
        <boxGeometry args={[0.48, 0.2, 0.07]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={ei} />
      </mesh>
      {/* L-shaped DRL L */}
      <mesh position={[0.72, 0.38, 2.262]}>
        <boxGeometry args={[0.48, 0.04, 0.05]} />
        <meshStandardMaterial color="#aadeff" emissive="#aadeff" emissiveIntensity={3.0} />
      </mesh>
      <mesh position={[0.95, 0.43, 2.26]}>
        <boxGeometry args={[0.04, 0.14, 0.05]} />
        <meshStandardMaterial color="#aadeff" emissive="#aadeff" emissiveIntensity={3.0} />
      </mesh>
      {/* Headlight housing R */}
      <mesh position={[-0.72, 0.5, 2.25]}>
        <boxGeometry args={[0.48, 0.2, 0.07]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={ei} />
      </mesh>
      {/* L-shaped DRL R */}
      <mesh position={[-0.72, 0.38, 2.262]}>
        <boxGeometry args={[0.48, 0.04, 0.05]} />
        <meshStandardMaterial color="#aadeff" emissive="#aadeff" emissiveIntensity={3.0} />
      </mesh>
      <mesh position={[-0.95, 0.43, 2.26]}>
        <boxGeometry args={[0.04, 0.14, 0.05]} />
        <meshStandardMaterial color="#aadeff" emissive="#aadeff" emissiveIntensity={3.0} />
      </mesh>
      {/* BMW roundel position on hood */}
      <mesh position={[0, 0.77, 1.55]}>
        <cylinderGeometry args={[0.1, 0.1, 0.015, 16]} />
        <meshStandardMaterial color="#1c69d4" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Rear taillights L/R */}
      <mesh position={[0.7, 0.5, -2.26]}>
        <boxGeometry args={[0.44, 0.22, 0.06]} />
        <meshStandardMaterial color="#cc0000" emissive="#cc0000" emissiveIntensity={isNight ? 4 : 2.5} />
      </mesh>
      <mesh position={[-0.7, 0.5, -2.26]}>
        <boxGeometry args={[0.44, 0.22, 0.06]} />
        <meshStandardMaterial color="#cc0000" emissive="#cc0000" emissiveIntensity={isNight ? 4 : 2.5} />
      </mesh>
      {/* Spoiler */}
      <mesh position={[0, 1.06, -2.2]}>
        <boxGeometry args={[1.72, 0.06, 0.35]} />
        <meshStandardMaterial color="#111" roughness={0.5} metalness={0.5} />
      </mesh>
    </>
  );
}

/* ─── Mercedes front/rear ─── */
function MercedesFront({ isNight }: { isNight: boolean }) {
  const ei = isNight ? 4 : 1.5;
  return (
    <>
      {/* Front bumper */}
      <mesh position={[0, 0.22, 2.28]}>
        <boxGeometry args={[2.1, 0.28, 0.16]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>
      {/* Wide AMG grille */}
      <mesh position={[0, 0.44, 2.25]}>
        <boxGeometry args={[1.55, 0.3, 0.09]} />
        <meshStandardMaterial color="#060606" roughness={0.9} />
      </mesh>
      {/* Grille horizontal bars */}
      {[-0.08, 0, 0.08].map((y, i) => (
        <mesh key={i} position={[0, 0.44 + y, 2.27]}>
          <boxGeometry args={[1.5, 0.03, 0.05]} />
          <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* Three-star logo hint (cross shape) */}
      <mesh position={[0, 0.44, 2.29]}>
        <boxGeometry args={[0.12, 0.03, 0.05]} />
        <meshStandardMaterial color="#ccc" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.44, 2.29]}>
        <boxGeometry args={[0.03, 0.12, 0.05]} />
        <meshStandardMaterial color="#ccc" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Wide flat headlights */}
      <mesh position={[0.72, 0.52, 2.25]}>
        <boxGeometry args={[0.5, 0.14, 0.07]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={ei} />
      </mesh>
      <mesh position={[-0.72, 0.52, 2.25]}>
        <boxGeometry args={[0.5, 0.14, 0.07]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={ei} />
      </mesh>
      {/* Three-line DRL */}
      {[0, 0.055, 0.11].map((dy, i) => (
        <>
          <mesh key={`drl-l-${i}`} position={[0.72, 0.38 + dy, 2.263]}>
            <boxGeometry args={[0.48, 0.03, 0.04]} />
            <meshStandardMaterial color="#ccddff" emissive="#ccddff" emissiveIntensity={2.5} />
          </mesh>
          <mesh key={`drl-r-${i}`} position={[-0.72, 0.38 + dy, 2.263]}>
            <boxGeometry args={[0.48, 0.03, 0.04]} />
            <meshStandardMaterial color="#ccddff" emissive="#ccddff" emissiveIntensity={2.5} />
          </mesh>
        </>
      ))}
      {/* Hood ornament base */}
      <mesh position={[0, 0.77, 2.1]}>
        <cylinderGeometry args={[0.06, 0.06, 0.05, 12]} />
        <meshStandardMaterial color="#ccc" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Rear taillights - wide horizontal style */}
      <mesh position={[0.65, 0.52, -2.26]}>
        <boxGeometry args={[0.5, 0.16, 0.06]} />
        <meshStandardMaterial color="#cc0000" emissive="#cc0000" emissiveIntensity={isNight ? 4 : 2.5} />
      </mesh>
      <mesh position={[-0.65, 0.52, -2.26]}>
        <boxGeometry args={[0.5, 0.16, 0.06]} />
        <meshStandardMaterial color="#cc0000" emissive="#cc0000" emissiveIntensity={isNight ? 4 : 2.5} />
      </mesh>
      {/* AMG spoiler */}
      <mesh position={[0, 1.08, -2.2]}>
        <boxGeometry args={[1.76, 0.055, 0.38]} />
        <meshStandardMaterial color="#111" roughness={0.4} metalness={0.6} />
      </mesh>
    </>
  );
}

/* ─── Audi front/rear ─── */
function AudiFront({ isNight }: { isNight: boolean }) {
  const ei = isNight ? 4 : 1.5;
  return (
    <>
      {/* Front bumper */}
      <mesh position={[0, 0.22, 2.28]}>
        <boxGeometry args={[2.1, 0.28, 0.16]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>
      {/* Singleframe large grille */}
      <mesh position={[0, 0.42, 2.25]}>
        <boxGeometry args={[1.6, 0.42, 0.1]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      {/* Grille frame */}
      <mesh position={[0, 0.42, 2.26]}>
        <boxGeometry args={[1.62, 0.44, 0.06]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Inner grille mesh hint */}
      {[-3, -1, 1, 3].map(x => (
        <mesh key={x} position={[x * 0.18, 0.42, 2.28]}>
          <boxGeometry args={[0.03, 0.4, 0.04]} />
          <meshStandardMaterial color="#333" metalness={0.5} />
        </mesh>
      ))}
      {/* Full-width LED DRL strip */}
      <mesh position={[0, 0.65, 2.262]}>
        <boxGeometry args={[1.7, 0.045, 0.05]} />
        <meshStandardMaterial color="#ccddff" emissive="#ccddff" emissiveIntensity={3.5} />
      </mesh>
      {/* Headlight clusters (matrix) */}
      <mesh position={[0.75, 0.54, 2.25]}>
        <boxGeometry args={[0.44, 0.18, 0.07]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={ei} />
      </mesh>
      <mesh position={[-0.75, 0.54, 2.25]}>
        <boxGeometry args={[0.44, 0.18, 0.07]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={ei} />
      </mesh>
      {/* Second DRL row (matrix hint) */}
      <mesh position={[0.75, 0.38, 2.263]}>
        <boxGeometry args={[0.44, 0.04, 0.05]} />
        <meshStandardMaterial color="#aaddff" emissive="#aaddff" emissiveIntensity={2.0} />
      </mesh>
      <mesh position={[-0.75, 0.38, 2.263]}>
        <boxGeometry args={[0.44, 0.04, 0.05]} />
        <meshStandardMaterial color="#aaddff" emissive="#aaddff" emissiveIntensity={2.0} />
      </mesh>
      {/* Four rings hint on grille */}
      {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.42, 2.29]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06, 0.015, 8, 16]} />
          <meshStandardMaterial color="#ccc" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}
      {/* Rear taillights - thin horizontal strip */}
      <mesh position={[0, 0.56, -2.27]}>
        <boxGeometry args={[1.78, 0.06, 0.05]} />
        <meshStandardMaterial color="#ff1100" emissive="#ff1100" emissiveIntensity={isNight ? 5 : 2.5} />
      </mesh>
      <mesh position={[0.7, 0.48, -2.26]}>
        <boxGeometry args={[0.44, 0.18, 0.06]} />
        <meshStandardMaterial color="#aa0000" emissive="#aa0000" emissiveIntensity={isNight ? 3.5 : 2} />
      </mesh>
      <mesh position={[-0.7, 0.48, -2.26]}>
        <boxGeometry args={[0.44, 0.18, 0.06]} />
        <meshStandardMaterial color="#aa0000" emissive="#aa0000" emissiveIntensity={isNight ? 3.5 : 2} />
      </mesh>
      {/* RS spoiler */}
      <mesh position={[0, 1.07, -2.22]}>
        <boxGeometry args={[1.74, 0.06, 0.36]} />
        <meshStandardMaterial color="#111" roughness={0.3} metalness={0.7} />
      </mesh>
    </>
  );
}

/* ─── Tofaş Şahin front/rear ─── */
function TofasFront({ color, isNight }: { color: string; isNight: boolean }) {
  const ei = isNight ? 3 : 1;
  return (
    <>
      {/* Tall upright front bumper (chrome style) */}
      <mesh position={[0, 0.28, 2.25]}>
        <boxGeometry args={[2.1, 0.36, 0.2]} />
        <meshStandardMaterial color="#ccc" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Lower valance */}
      <mesh position={[0, 0.1, 2.24]}>
        <boxGeometry args={[2.0, 0.14, 0.15]} />
        <meshStandardMaterial color="#222" roughness={0.7} />
      </mesh>
      {/* Narrow vertical grille (classic style) */}
      <mesh position={[0, 0.48, 2.22]}>
        <boxGeometry args={[0.9, 0.32, 0.1]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      {/* Grille vertical bars */}
      {[-0.35, -0.18, 0, 0.18, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0.48, 2.24]}>
          <boxGeometry args={[0.04, 0.3, 0.06]} />
          <meshStandardMaterial color="#555" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* Round sealed-beam headlights */}
      {[0.72, -0.72].map(x => (
        <group key={x}>
          <mesh position={[x, 0.52, 2.22]}>
            <cylinderGeometry args={[0.2, 0.2, 0.08, 16]} />
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={ei} />
          </mesh>
          {/* Headlight chrome ring */}
          <mesh position={[x, 0.52, 2.22]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.025, 8, 16]} />
            <meshStandardMaterial color="#ccc" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Turn signal amber */}
          <mesh position={[x, 0.3, 2.23]}>
            <cylinderGeometry args={[0.1, 0.1, 0.06, 12]} />
            <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
      {/* Rear chrome bumper */}
      <mesh position={[0, 0.28, -2.25]}>
        <boxGeometry args={[2.1, 0.36, 0.2]} />
        <meshStandardMaterial color="#ccc" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Round taillights */}
      {[0.7, -0.7].map(x => (
        <group key={x}>
          <mesh position={[x, 0.52, -2.22]}>
            <cylinderGeometry args={[0.18, 0.18, 0.07, 14]} />
            <meshStandardMaterial color="#cc0000" emissive="#cc0000" emissiveIntensity={isNight ? 4 : 2} />
          </mesh>
          <mesh position={[x * 0.5, 0.52, -2.22]}>
            <cylinderGeometry args={[0.12, 0.12, 0.07, 12]} />
            <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
      {/* License plate area */}
      <mesh position={[0, 0.38, -2.3]}>
        <boxGeometry args={[0.6, 0.15, 0.04]} />
        <meshStandardMaterial color="#ffffee" emissive="#ffffee" emissiveIntensity={isNight ? 1.5 : 0.1} />
      </mesh>
      {/* No spoiler - classic look, chrome trunk trim */}
      <mesh position={[0, 0.8, -2.2]}>
        <boxGeometry args={[1.8, 0.05, 0.15]} />
        <meshStandardMaterial color="#bbb" metalness={0.85} roughness={0.2} />
      </mesh>
    </>
  );
}

/* ─── Main export ─── */
export const PlayerCarMesh = forwardRef<Group, Props>(({ color = '#e11d48', isNight = false, brand = 'bmw' }, ref) => {
  return (
    <group ref={ref}>
      <BaseBody color={color} isNight={isNight}>
        {brand === 'bmw' && <BMWFront isNight={isNight} />}
        {brand === 'mercedes' && <MercedesFront isNight={isNight} />}
        {brand === 'audi' && <AudiFront isNight={isNight} />}
        {brand === 'tofas' && <TofasFront color={color} isNight={isNight} />}
      </BaseBody>
    </group>
  );
});

PlayerCarMesh.displayName = 'PlayerCarMesh';

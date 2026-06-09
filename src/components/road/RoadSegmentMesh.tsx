'use client';
import { forwardRef } from 'react';
import { Mesh } from 'three';
import { ROAD_WIDTH, LANE_WIDTH, SEGMENT_LENGTH } from '@/utils/constants';

interface Props { isNight?: boolean }

const DASH_COUNT  = 16;
const DASH_LEN    = SEGMENT_LENGTH / DASH_COUNT / 2;
const DASH_GAP    = SEGMENT_LENGTH / DASH_COUNT / 2;
const ROAD_HALF   = ROAD_WIDTH / 2;   // 8.4
const SHOULDER_W  = 2.2;

function dashPositions(): number[] {
  const pos: number[] = [];
  for (let i = 0; i < DASH_COUNT; i++) {
    pos.push(-SEGMENT_LENGTH / 2 + i * (DASH_LEN + DASH_GAP) + DASH_LEN / 2);
  }
  return pos;
}
const DASHES = dashPositions();

// Lane dividers: right side at x = LANE_WIDTH, 2*LANE_WIDTH (= 2.8, 5.6)
// Left side mirrored: -2.8, -5.6
const RIGHT_DIVIDERS = [LANE_WIDTH, LANE_WIDTH * 2] as const;         // 2.8, 5.6
const LEFT_DIVIDERS  = [-LANE_WIDTH, -LANE_WIDTH * 2] as const;       // -2.8, -5.6

export const RoadSegmentMesh = forwardRef<Mesh, Props>(({ isNight = false }, ref) => {
  const asphalt  = isNight ? '#181818' : '#272727';
  const marking  = isNight ? '#b0b0b0' : '#f0f0f0';
  const shoulder = isNight ? '#121212' : '#1c1c1c';

  return (
    <group>
      {/* ── MAIN ASPHALT ───────────────────────────────────── */}
      <mesh ref={ref} position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[ROAD_WIDTH, 0.14, SEGMENT_LENGTH]} />
        <meshStandardMaterial color={asphalt} roughness={0.88} metalness={0.02} />
      </mesh>

      {/* Slight aged-centre tint */}
      <mesh position={[0, 0.071, 0]}>
        <boxGeometry args={[ROAD_WIDTH - 0.6, 0.004, SEGMENT_LENGTH]} />
        <meshStandardMaterial color={isNight ? '#1c1c1c' : '#2c2c2c'} roughness={0.9} />
      </mesh>

      {/* ── SHOULDERS ─────────────────────────────────────── */}
      {([1, -1] as const).map(s => (
        <mesh key={s} position={[s * (ROAD_HALF + SHOULDER_W / 2), -0.01, 0]} receiveShadow>
          <boxGeometry args={[SHOULDER_W, 0.12, SEGMENT_LENGTH]} />
          <meshStandardMaterial color={shoulder} roughness={0.95} />
        </mesh>
      ))}

      {/* Rumble strips */}
      {([1, -1] as const).map(s => (
        <mesh key={s} position={[s * (ROAD_HALF + 0.28), 0.072, 0]}>
          <boxGeometry args={[0.56, 0.013, SEGMENT_LENGTH]} />
          <meshStandardMaterial color={isNight ? '#7a2200' : '#cc4400'} roughness={0.8} />
        </mesh>
      ))}

      {/* ── CENTRE DOUBLE YELLOW ──────────────────────────── */}
      {([0.14, -0.14] as const).map(x => (
        <mesh key={x} position={[x, 0.076, 0]}>
          <boxGeometry args={[0.13, 0.013, SEGMENT_LENGTH]} />
          <meshStandardMaterial
            color="#ffcc00"
            emissive="#ffcc00"
            emissiveIntensity={isNight ? 0.55 : 0.18}
          />
        </mesh>
      ))}

      {/* ── LANE DASHES — right side ──────────────────────── */}
      {RIGHT_DIVIDERS.map(dx =>
        DASHES.map((z, i) => (
          <mesh key={`rd-${dx}-${i}`} position={[dx, 0.076, z]}>
            <boxGeometry args={[0.13, 0.013, DASH_LEN]} />
            <meshStandardMaterial
              color={marking}
              emissive={marking}
              emissiveIntensity={isNight ? 0.38 : 0.1}
            />
          </mesh>
        ))
      )}

      {/* ── LANE DASHES — left side (oncoming) ───────────── */}
      {LEFT_DIVIDERS.map(dx =>
        DASHES.map((z, i) => (
          <mesh key={`ld-${dx}-${i}`} position={[dx, 0.076, z]}>
            <boxGeometry args={[0.13, 0.013, DASH_LEN]} />
            <meshStandardMaterial
              color={marking}
              emissive={marking}
              emissiveIntensity={isNight ? 0.38 : 0.1}
            />
          </mesh>
        ))
      )}

      {/* ── EDGE SOLID LINES ─────────────────────────────── */}
      {([ROAD_HALF - 0.16, -(ROAD_HALF - 0.16)] as const).map(x => (
        <mesh key={x} position={[x, 0.076, 0]}>
          <boxGeometry args={[0.19, 0.013, SEGMENT_LENGTH]} />
          <meshStandardMaterial
            color={marking}
            emissive={marking}
            emissiveIntensity={isNight ? 0.33 : 0.1}
          />
        </mesh>
      ))}

      {/* ── GUARD RAILS ──────────────────────────────────── */}
      {([1, -1] as const).map(s => {
        const rx = s * (ROAD_HALF + 2.6);
        return (
          <group key={s}>
            <mesh position={[rx, 0.46, 0]} castShadow>
              <boxGeometry args={[0.18, 0.36, SEGMENT_LENGTH]} />
              <meshStandardMaterial color="#b0b8c0" metalness={0.8} roughness={0.25} />
            </mesh>
            <mesh position={[rx, 0.31, 0]}>
              <boxGeometry args={[0.12, 0.12, SEGMENT_LENGTH]} />
              <meshStandardMaterial color="#9aa0a8" metalness={0.75} roughness={0.3} />
            </mesh>
          </group>
        );
      })}

      {/* Rail posts every 10 units */}
      {Array.from({ length: Math.floor(SEGMENT_LENGTH / 10) }).map((_, i) => {
        const z = -SEGMENT_LENGTH / 2 + i * 10 + 5;
        return ([1, -1] as const).map(s => (
          <group key={`post-${i}-${s}`} position={[s * (ROAD_HALF + 2.6), 0, z]}>
            <mesh position={[0, 0.32, 0]}>
              <boxGeometry args={[0.14, 0.64, 0.14]} />
              <meshStandardMaterial color="#808890" metalness={0.65} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[0.25, 0.08, 0.25]} />
              <meshStandardMaterial color="#888" roughness={0.9} />
            </mesh>
          </group>
        ));
      })}

      {/* ── STREET LAMPS every 30 units ───────────────────── */}
      {Array.from({ length: Math.floor(SEGMENT_LENGTH / 30) }).map((_, i) => {
        const z    = -SEGMENT_LENGTH / 2 + i * 30 + 15;
        const lampX = ROAD_HALF + 4.2;
        return ([1, -1] as const).map(s => {
          const x = s * lampX;
          return (
            <group key={`lamp-${i}-${s}`} position={[x, 0, z]}>
              {/* Pole */}
              <mesh position={[0, 3.0, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.13, 6.0, 8]} />
                <meshStandardMaterial color="#606878" metalness={0.85} roughness={0.3} />
              </mesh>
              {/* Arm toward road */}
              <mesh position={[s > 0 ? -0.9 : 0.9, 6.1, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.055, 0.055, 1.8, 7]} />
                <meshStandardMaterial color="#606878" metalness={0.85} roughness={0.3} />
              </mesh>
              {/* Lamp head */}
              <mesh position={[s > 0 ? -1.75 : 1.75, 6.0, 0]}>
                <boxGeometry args={[0.55, 0.22, 0.42]} />
                <meshStandardMaterial
                  color="#ffffcc"
                  emissive="#ffffcc"
                  emissiveIntensity={isNight ? 4.5 : 0.1}
                />
              </mesh>
              <mesh position={[s > 0 ? -1.75 : 1.75, 5.9, 0]}>
                <boxGeometry args={[0.58, 0.05, 0.44]} />
                <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
              </mesh>
              {isNight && (
                <pointLight
                  position={[s > 0 ? -1.75 : 1.75, 5.8, 0]}
                  intensity={26}
                  distance={24}
                  color="#ffd070"
                  decay={2}
                />
              )}
            </group>
          );
        });
      })}
    </group>
  );
});

RoadSegmentMesh.displayName = 'RoadSegmentMesh';

'use client';
import { forwardRef } from 'react';
import { Mesh } from 'three';
import { ROAD_WIDTH, LANE_WIDTH, SEGMENT_LENGTH } from '@/utils/constants';

interface Props { isNight?: boolean }

const DASH_COUNT = 16;
const DASH_LENGTH = SEGMENT_LENGTH / DASH_COUNT / 2;
const DASH_GAP = SEGMENT_LENGTH / DASH_COUNT / 2;

export const RoadSegmentMesh = forwardRef<Mesh, Props>(({ isNight = false }, ref) => {
  const asphaltColor = isNight ? '#1a1a1a' : '#2a2a2a';
  const markingColor = isNight ? '#aaaaaa' : '#ffffff';
  const shoulderColor = isNight ? '#141414' : '#1e1e1e';

  const dashPositions: number[] = [];
  for (let i = 0; i < DASH_COUNT; i++) {
    dashPositions.push(-SEGMENT_LENGTH / 2 + i * (DASH_LENGTH + DASH_GAP) + DASH_LENGTH / 2);
  }

  return (
    <group>
      {/* === ROAD SURFACE === */}
      {/* Main asphalt */}
      <mesh ref={ref} position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[ROAD_WIDTH, 0.14, SEGMENT_LENGTH]} />
        <meshStandardMaterial
          color={asphaltColor}
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>
      {/* Slightly lighter center strip (aged asphalt) */}
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[ROAD_WIDTH - 0.4, 0.005, SEGMENT_LENGTH]} />
        <meshStandardMaterial color={isNight ? '#1d1d1d' : '#2d2d2d'} roughness={0.9} />
      </mesh>

      {/* === SHOULDERS === */}
      <mesh position={[ROAD_WIDTH / 2 + 1.8, -0.01, 0]} receiveShadow>
        <boxGeometry args={[3.6, 0.12, SEGMENT_LENGTH]} />
        <meshStandardMaterial color={shoulderColor} roughness={0.95} />
      </mesh>
      <mesh position={[-(ROAD_WIDTH / 2 + 1.8), -0.01, 0]} receiveShadow>
        <boxGeometry args={[3.6, 0.12, SEGMENT_LENGTH]} />
        <meshStandardMaterial color={shoulderColor} roughness={0.95} />
      </mesh>

      {/* Rumble strips (orange/red at edge of shoulder) */}
      <mesh position={[ROAD_WIDTH / 2 + 0.25, 0.07, 0]}>
        <boxGeometry args={[0.5, 0.012, SEGMENT_LENGTH]} />
        <meshStandardMaterial color={isNight ? '#6a2200' : '#cc4400'} roughness={0.8} />
      </mesh>
      <mesh position={[-(ROAD_WIDTH / 2 + 0.25), 0.07, 0]}>
        <boxGeometry args={[0.5, 0.012, SEGMENT_LENGTH]} />
        <meshStandardMaterial color={isNight ? '#6a2200' : '#cc4400'} roughness={0.8} />
      </mesh>

      {/* === CENTER DOUBLE YELLOW LINE === */}
      <mesh position={[0.12, 0.075, 0]}>
        <boxGeometry args={[0.15, 0.012, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={isNight ? 0.5 : 0.15} />
      </mesh>
      <mesh position={[-0.12, 0.075, 0]}>
        <boxGeometry args={[0.15, 0.012, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={isNight ? 0.5 : 0.15} />
      </mesh>

      {/* === LANE DASHES === */}
      {[1, 2].map(lane => {
        const x = -ROAD_WIDTH / 2 + lane * LANE_WIDTH;
        return dashPositions.map((z, i) => (
          <mesh key={`${lane}-${i}`} position={[x, 0.075, z]}>
            <boxGeometry args={[0.14, 0.012, DASH_LENGTH]} />
            <meshStandardMaterial
              color={markingColor}
              emissive={markingColor}
              emissiveIntensity={isNight ? 0.4 : 0.12}
            />
          </mesh>
        ));
      })}

      {/* === EDGE SOLID LINES === */}
      <mesh position={[ROAD_WIDTH / 2 - 0.15, 0.075, 0]}>
        <boxGeometry args={[0.2, 0.012, SEGMENT_LENGTH]} />
        <meshStandardMaterial color={markingColor} emissive={markingColor} emissiveIntensity={isNight ? 0.35 : 0.1} />
      </mesh>
      <mesh position={[-(ROAD_WIDTH / 2 - 0.15), 0.075, 0]}>
        <boxGeometry args={[0.2, 0.012, SEGMENT_LENGTH]} />
        <meshStandardMaterial color={markingColor} emissive={markingColor} emissiveIntensity={isNight ? 0.35 : 0.1} />
      </mesh>

      {/* === GUARD RAILS === */}
      {/* W-beam rail right */}
      <mesh position={[ROAD_WIDTH / 2 + 2.6, 0.45, 0]} castShadow>
        <boxGeometry args={[0.18, 0.35, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#b0b8c0" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[ROAD_WIDTH / 2 + 2.6, 0.3, 0]}>
        <boxGeometry args={[0.12, 0.12, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#9aa0a8" metalness={0.75} roughness={0.3} />
      </mesh>
      {/* W-beam rail left */}
      <mesh position={[-(ROAD_WIDTH / 2 + 2.6), 0.45, 0]} castShadow>
        <boxGeometry args={[0.18, 0.35, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#b0b8c0" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[-(ROAD_WIDTH / 2 + 2.6), 0.3, 0]}>
        <boxGeometry args={[0.12, 0.12, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#9aa0a8" metalness={0.75} roughness={0.3} />
      </mesh>

      {/* Rail posts every 10 units */}
      {Array.from({ length: Math.floor(SEGMENT_LENGTH / 10) }).map((_, i) => {
        const z = -SEGMENT_LENGTH / 2 + i * 10 + 5;
        return [ROAD_WIDTH / 2 + 2.6, -(ROAD_WIDTH / 2 + 2.6)].map((x, si) => (
          <group key={`post-${i}-${si}`} position={[x, 0, z]}>
            <mesh position={[0, 0.32, 0]}>
              <boxGeometry args={[0.14, 0.64, 0.14]} />
              <meshStandardMaterial color="#808890" metalness={0.65} roughness={0.4} />
            </mesh>
            {/* Post base concrete */}
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[0.25, 0.08, 0.25]} />
              <meshStandardMaterial color="#888" roughness={0.9} />
            </mesh>
          </group>
        ));
      })}

      {/* === STREET LAMPS every 30 units === */}
      {Array.from({ length: Math.floor(SEGMENT_LENGTH / 30) }).map((_, i) => {
        const z = -SEGMENT_LENGTH / 2 + i * 30 + 15;
        return [ROAD_WIDTH / 2 + 4.0, -(ROAD_WIDTH / 2 + 4.0)].map((x, si) => (
          <group key={`lamp-${i}-${si}`} position={[x, 0, z]}>
            {/* Pole */}
            <mesh position={[0, 3.0, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.12, 6.0, 8]} />
              <meshStandardMaterial color="#606878" metalness={0.85} roughness={0.3} />
            </mesh>
            {/* Arm extending over road */}
            <mesh
              position={[x > 0 ? -0.9 : 0.9, 6.1, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.055, 0.055, 1.8, 7]} />
              <meshStandardMaterial color="#606878" metalness={0.85} roughness={0.3} />
            </mesh>
            {/* Lamp head */}
            <mesh position={[x > 0 ? -1.75 : 1.75, 6.0, 0]}>
              <boxGeometry args={[0.55, 0.22, 0.4]} />
              <meshStandardMaterial
                color="#ffffcc"
                emissive="#ffffcc"
                emissiveIntensity={isNight ? 4 : 0.1}
              />
            </mesh>
            {/* Lamp cover (darker bottom) */}
            <mesh position={[x > 0 ? -1.75 : 1.75, 5.9, 0]}>
              <boxGeometry args={[0.58, 0.05, 0.42]} />
              <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
            </mesh>
            {isNight && (
              <pointLight
                position={[x > 0 ? -1.75 : 1.75, 5.8, 0]}
                intensity={22}
                distance={22}
                color="#ffd070"
                decay={2}
              />
            )}
          </group>
        ));
      })}
    </group>
  );
});

RoadSegmentMesh.displayName = 'RoadSegmentMesh';

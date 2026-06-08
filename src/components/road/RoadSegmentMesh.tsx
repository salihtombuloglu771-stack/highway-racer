'use client';
import { forwardRef } from 'react';
import { Mesh } from 'three';
import { ROAD_WIDTH, LANE_COUNT, LANE_WIDTH, SEGMENT_LENGTH } from '@/utils/constants';

interface Props { isNight?: boolean }

const RAIL_HEIGHT = 0.6;
const RAIL_THICK = 0.15;
const DASH_COUNT = 20;
const DASH_LENGTH = SEGMENT_LENGTH / DASH_COUNT / 2;
const DASH_GAP = SEGMENT_LENGTH / DASH_COUNT / 2;

export const RoadSegmentMesh = forwardRef<Mesh, Props>(({ isNight = false }, ref) => {
  const roadColor = isNight ? '#252525' : '#333';
  const lineColor = isNight ? '#888' : '#fff';
  const shoulderColor = isNight ? '#1a1a1a' : '#222';

  const dashPositions: number[] = [];
  for (let i = 0; i < DASH_COUNT; i++) {
    dashPositions.push(-SEGMENT_LENGTH / 2 + i * (DASH_LENGTH + DASH_GAP) + DASH_LENGTH / 2);
  }

  return (
    <group>
      {/* Road surface */}
      <mesh ref={ref} position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[ROAD_WIDTH, 0.12, SEGMENT_LENGTH]} />
        <meshStandardMaterial color={roadColor} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[ROAD_WIDTH / 2 + 1.5, -0.01, 0]} receiveShadow>
        <boxGeometry args={[3, 0.1, SEGMENT_LENGTH]} />
        <meshStandardMaterial color={shoulderColor} roughness={0.9} />
      </mesh>
      <mesh position={[-(ROAD_WIDTH / 2 + 1.5), -0.01, 0]} receiveShadow>
        <boxGeometry args={[3, 0.1, SEGMENT_LENGTH]} />
        <meshStandardMaterial color={shoulderColor} roughness={0.9} />
      </mesh>

      {/* Center solid line */}
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[0.2, 0.02, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#ffdd00" emissive="#ffdd00" emissiveIntensity={0.3} />
      </mesh>

      {/* Lane dash lines */}
      {[1, 2].map(lane => {
        const x = -ROAD_WIDTH / 2 + lane * LANE_WIDTH;
        return dashPositions.map((z, i) => (
          <mesh key={`${lane}-${i}`} position={[x, 0.07, z]}>
            <boxGeometry args={[0.12, 0.02, DASH_LENGTH]} />
            <meshStandardMaterial color={lineColor} emissive={lineColor} emissiveIntensity={0.15} />
          </mesh>
        ));
      })}

      {/* Edge lines */}
      <mesh position={[ROAD_WIDTH / 2, 0.07, 0]}>
        <boxGeometry args={[0.18, 0.02, SEGMENT_LENGTH]} />
        <meshStandardMaterial color={lineColor} emissive={lineColor} emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[-ROAD_WIDTH / 2, 0.07, 0]}>
        <boxGeometry args={[0.18, 0.02, SEGMENT_LENGTH]} />
        <meshStandardMaterial color={lineColor} emissive={lineColor} emissiveIntensity={0.15} />
      </mesh>

      {/* Guard rails */}
      <mesh position={[ROAD_WIDTH / 2 + 2.8, RAIL_HEIGHT / 2, 0]} castShadow>
        <boxGeometry args={[RAIL_THICK, RAIL_HEIGHT, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#aaa" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-(ROAD_WIDTH / 2 + 2.8), RAIL_HEIGHT / 2, 0]} castShadow>
        <boxGeometry args={[RAIL_THICK, RAIL_HEIGHT, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#aaa" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Rail posts every 10 units */}
      {Array.from({ length: Math.floor(SEGMENT_LENGTH / 10) }).map((_, i) => {
        const z = -SEGMENT_LENGTH / 2 + i * 10 + 5;
        return [ROAD_WIDTH / 2 + 2.8, -(ROAD_WIDTH / 2 + 2.8)].map(x => (
          <mesh key={`post-${i}-${x}`} position={[x, RAIL_HEIGHT / 2, z]}>
            <boxGeometry args={[0.12, RAIL_HEIGHT, 0.12]} />
            <meshStandardMaterial color="#888" metalness={0.6} />
          </mesh>
        ));
      })}

      {/* Street lamps every 30 units */}
      {Array.from({ length: Math.floor(SEGMENT_LENGTH / 30) }).map((_, i) => {
        const z = -SEGMENT_LENGTH / 2 + i * 30 + 15;
        return [ROAD_WIDTH / 2 + 3.5, -(ROAD_WIDTH / 2 + 3.5)].map((x, si) => (
          <group key={`lamp-${i}-${si}`} position={[x, 0, z]}>
            {/* Pole */}
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.07, 0.09, 5, 8]} />
              <meshStandardMaterial color="#666" metalness={0.8} />
            </mesh>
            {/* Arm */}
            <mesh position={[x > 0 ? -0.6 : 0.6, 5.1, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 1.2, 6]} />
              <meshStandardMaterial color="#666" metalness={0.8} />
            </mesh>
            {/* Lamp head */}
            <mesh position={[x > 0 ? -1.15 : 1.15, 5.1, 0]}>
              <boxGeometry args={[0.4, 0.15, 0.3]} />
              <meshStandardMaterial
                color="#ffffcc"
                emissive="#ffffcc"
                emissiveIntensity={isNight ? 3 : 0.1}
              />
            </mesh>
            {isNight && (
              <pointLight
                position={[x > 0 ? -1.15 : 1.15, 5.1, 0]}
                intensity={15}
                distance={18}
                color="#ffe8a0"
              />
            )}
          </group>
        ));
      })}
    </group>
  );
});

RoadSegmentMesh.displayName = 'RoadSegmentMesh';

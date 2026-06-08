'use client';
import { forwardRef } from 'react';
import { Group } from 'three';
import { TrafficType } from '@/utils/constants';

interface Props {
  type: TrafficType;
  color: string;
  isNight?: boolean;
}

const SmallWheel = ({ pos }: { pos: [number, number, number] }) => (
  <group position={pos} rotation={[0, 0, Math.PI / 2]}>
    <mesh>
      <cylinderGeometry args={[0.33, 0.33, 0.25, 14]} />
      <meshStandardMaterial color="#111" roughness={0.9} />
    </mesh>
    <mesh>
      <cylinderGeometry args={[0.18, 0.18, 0.27, 8]} />
      <meshStandardMaterial color="#888" metalness={0.8} />
    </mesh>
  </group>
);

const BigWheel = ({ pos }: { pos: [number, number, number] }) => (
  <group position={pos} rotation={[0, 0, Math.PI / 2]}>
    <mesh>
      <cylinderGeometry args={[0.42, 0.42, 0.35, 14]} />
      <meshStandardMaterial color="#111" roughness={0.9} />
    </mesh>
    <mesh>
      <cylinderGeometry args={[0.22, 0.22, 0.37, 8]} />
      <meshStandardMaterial color="#888" metalness={0.8} />
    </mesh>
  </group>
);

function Sedan({ color, isNight }: { color: string; isNight: boolean }) {
  return (
    <>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2.0, 0.7, 4.2]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.1, 0.1]} castShadow>
        <boxGeometry args={[1.6, 0.6, 2.2]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.1, 1.0]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[1.45, 0.45, 0.05]} />
        <meshStandardMaterial color="#99ccff" transparent opacity={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[0.62, 0.56, 2.16]}>
        <boxGeometry args={[0.45, 0.16, 0.05]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={isNight ? 2.5 : 0.8} />
      </mesh>
      <mesh position={[-0.62, 0.56, 2.16]}>
        <boxGeometry args={[0.45, 0.16, 0.05]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={isNight ? 2.5 : 0.8} />
      </mesh>
      <mesh position={[0.62, 0.56, -2.16]}>
        <boxGeometry args={[0.45, 0.16, 0.05]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={isNight ? 2.5 : 1} />
      </mesh>
      <mesh position={[-0.62, 0.56, -2.16]}>
        <boxGeometry args={[0.45, 0.16, 0.05]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={isNight ? 2.5 : 1} />
      </mesh>
      <SmallWheel pos={[1.08, 0.33, 1.4]} />
      <SmallWheel pos={[-1.08, 0.33, 1.4]} />
      <SmallWheel pos={[1.08, 0.33, -1.4]} />
      <SmallWheel pos={[-1.08, 0.33, -1.4]} />
    </>
  );
}

function SUV({ color, isNight }: { color: string; isNight: boolean }) {
  return (
    <>
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[2.1, 0.9, 4.5]} />
        <meshStandardMaterial color={color} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.42, 0.2]} castShadow>
        <boxGeometry args={[1.9, 0.7, 3.2]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.42, 1.45]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[1.7, 0.55, 0.05]} />
        <meshStandardMaterial color="#99ccff" transparent opacity={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[0.7, 0.7, 2.26]}>
        <boxGeometry args={[0.5, 0.2, 0.06]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={isNight ? 2.5 : 0.8} />
      </mesh>
      <mesh position={[-0.7, 0.7, 2.26]}>
        <boxGeometry args={[0.5, 0.2, 0.06]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={isNight ? 2.5 : 0.8} />
      </mesh>
      <mesh position={[0.7, 0.7, -2.26]}>
        <boxGeometry args={[0.5, 0.2, 0.06]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={isNight ? 2.5 : 1} />
      </mesh>
      <mesh position={[-0.7, 0.7, -2.26]}>
        <boxGeometry args={[0.5, 0.2, 0.06]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={isNight ? 2.5 : 1} />
      </mesh>
      <SmallWheel pos={[1.15, 0.42, 1.5]} />
      <SmallWheel pos={[-1.15, 0.42, 1.5]} />
      <SmallWheel pos={[1.15, 0.42, -1.5]} />
      <SmallWheel pos={[-1.15, 0.42, -1.5]} />
    </>
  );
}

function Truck({ color, isNight }: { color: string; isNight: boolean }) {
  return (
    <>
      {/* Cabin */}
      <mesh position={[0, 0.9, 3.5]} castShadow>
        <boxGeometry args={[2.2, 1.7, 3.0]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Container */}
      <mesh position={[0, 1.0, -1.8]} castShadow>
        <boxGeometry args={[2.3, 2.0, 7.5]} />
        <meshStandardMaterial color="#ddd" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Cabin windows */}
      <mesh position={[0, 1.3, 5.06]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[1.8, 0.7, 0.05]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.6} metalness={0.8} />
      </mesh>
      <mesh position={[0.9, 1.3, 4.0]}>
        <boxGeometry args={[0.05, 0.6, 1.2]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[-0.9, 1.3, 4.0]}>
        <boxGeometry args={[0.05, 0.6, 1.2]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.5} metalness={0.8} />
      </mesh>
      {/* Headlights */}
      <mesh position={[0.75, 0.7, 5.06]}>
        <boxGeometry args={[0.5, 0.22, 0.06]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={isNight ? 3 : 1} />
      </mesh>
      <mesh position={[-0.75, 0.7, 5.06]}>
        <boxGeometry args={[0.5, 0.22, 0.06]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={isNight ? 3 : 1} />
      </mesh>
      {/* Taillights */}
      <mesh position={[0.9, 0.7, -5.56]}>
        <boxGeometry args={[0.4, 0.2, 0.05]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={isNight ? 3 : 1.2} />
      </mesh>
      <mesh position={[-0.9, 0.7, -5.56]}>
        <boxGeometry args={[0.4, 0.2, 0.05]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={isNight ? 3 : 1.2} />
      </mesh>
      {/* Big wheels */}
      <BigWheel pos={[1.2, 0.42, 4.0]} />
      <BigWheel pos={[-1.2, 0.42, 4.0]} />
      <BigWheel pos={[1.2, 0.42, 2.2]} />
      <BigWheel pos={[-1.2, 0.42, 2.2]} />
      <BigWheel pos={[1.2, 0.42, -1.5]} />
      <BigWheel pos={[-1.2, 0.42, -1.5]} />
      <BigWheel pos={[1.2, 0.42, -3.0]} />
      <BigWheel pos={[-1.2, 0.42, -3.0]} />
    </>
  );
}

function Bus({ color, isNight }: { color: string; isNight: boolean }) {
  return (
    <>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[2.3, 2.0, 8.5]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Windows strip */}
      <mesh position={[1.17, 1.4, 0]}>
        <boxGeometry args={[0.06, 0.6, 7.0]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.55} metalness={0.8} />
      </mesh>
      <mesh position={[-1.17, 1.4, 0]}>
        <boxGeometry args={[0.06, 0.6, 7.0]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.55} metalness={0.8} />
      </mesh>
      {/* Front windshield */}
      <mesh position={[0, 1.3, 4.28]}>
        <boxGeometry args={[2.1, 0.8, 0.06]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.55} metalness={0.8} />
      </mesh>
      <mesh position={[0.8, 0.65, 4.29]}>
        <boxGeometry args={[0.5, 0.22, 0.06]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={isNight ? 3 : 0.8} />
      </mesh>
      <mesh position={[-0.8, 0.65, 4.29]}>
        <boxGeometry args={[0.5, 0.22, 0.06]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={isNight ? 3 : 0.8} />
      </mesh>
      <mesh position={[0.8, 0.65, -4.29]}>
        <boxGeometry args={[0.5, 0.22, 0.06]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={isNight ? 3 : 1.2} />
      </mesh>
      <mesh position={[-0.8, 0.65, -4.29]}>
        <boxGeometry args={[0.5, 0.22, 0.06]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={isNight ? 3 : 1.2} />
      </mesh>
      <BigWheel pos={[1.22, 0.42, 3.2]} />
      <BigWheel pos={[-1.22, 0.42, 3.2]} />
      <BigWheel pos={[1.22, 0.42, -3.2]} />
      <BigWheel pos={[-1.22, 0.42, -3.2]} />
    </>
  );
}

function SportCar({ color, isNight }: { color: string; isNight: boolean }) {
  return (
    <>
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[2.3, 0.6, 4.6]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.92, 0.1]} castShadow>
        <boxGeometry args={[1.8, 0.52, 2.0]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.9, 1.0]} rotation={[0.45, 0, 0]}>
        <boxGeometry args={[1.65, 0.45, 0.05]} />
        <meshStandardMaterial color="#aaddff" transparent opacity={0.5} metalness={0.95} />
      </mesh>
      <mesh position={[0, 0.95, -2.2]}>
        <boxGeometry args={[2.2, 0.15, 0.6]} />
        <meshStandardMaterial color={color} metalness={0.8} />
      </mesh>
      <mesh position={[0.78, 0.48, 2.32]}>
        <boxGeometry args={[0.55, 0.15, 0.06]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={isNight ? 3 : 1.2} />
      </mesh>
      <mesh position={[-0.78, 0.48, 2.32]}>
        <boxGeometry args={[0.55, 0.15, 0.06]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={isNight ? 3 : 1.2} />
      </mesh>
      <mesh position={[0.78, 0.48, -2.32]}>
        <boxGeometry args={[0.55, 0.15, 0.06]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={isNight ? 3 : 1.5} />
      </mesh>
      <mesh position={[-0.78, 0.48, -2.32]}>
        <boxGeometry args={[0.55, 0.15, 0.06]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={isNight ? 3 : 1.5} />
      </mesh>
      <SmallWheel pos={[1.2, 0.32, 1.55]} />
      <SmallWheel pos={[-1.2, 0.32, 1.55]} />
      <SmallWheel pos={[1.2, 0.32, -1.55]} />
      <SmallWheel pos={[-1.2, 0.32, -1.55]} />
    </>
  );
}

export const TrafficCarMesh = forwardRef<Group, Props>(({ type, color, isNight = false }, ref) => {
  return (
    <group ref={ref}>
      {type === 'sedan' && <Sedan color={color} isNight={isNight} />}
      {type === 'suv' && <SUV color={color} isNight={isNight} />}
      {type === 'truck' && <Truck color={color} isNight={isNight} />}
      {type === 'bus' && <Bus color={color} isNight={isNight} />}
      {type === 'sport' && <SportCar color={color} isNight={isNight} />}
    </group>
  );
});

TrafficCarMesh.displayName = 'TrafficCarMesh';

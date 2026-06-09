'use client';
import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import { CarModel } from '@/store/gameStore';

// GLB file path per car model
export const CAR_GLB: Record<CarModel, string> = {
  sport:    '/models/ferrari.glb',
  classic:  '/models/car_generic.glb',
  muscle:   '/models/car_generic.glb',
  electric: '/models/car_generic.glb',
  hypercar: '/models/lamborghini.glb',
};

// Y-rotation to make each model face forward (-Z) in game
// 0 = model already faces -Z, Math.PI = model faces +Z (needs flip)
const CAR_ROT: Partial<Record<string, number>> = {
  '/models/ferrari.glb':     Math.PI,
  '/models/lamborghini.glb': Math.PI,
};

// Preload all unique URLs at module level (safe — not a hook)
const _seen = new Set<string>();
Object.values(CAR_GLB).forEach(url => {
  if (!_seen.has(url)) { _seen.add(url); useGLTF.preload(url); }
});

interface Props {
  url: string;
}

export function GLBCarBody({ url }: Props) {
  const { scene } = useGLTF(url);

  const cloned = useMemo(() => {
    const c = scene.clone(true);

    // Clone materials so instances are independent
    c.traverse((child: any) => {
      if (!child.isMesh) return;
      if (Array.isArray(child.material)) {
        child.material = child.material.map((m: any) => m.clone());
      } else if (child.material) {
        child.material = child.material.clone();
      }
      child.castShadow    = true;
      child.receiveShadow = true;
    });

    return c;
  }, [scene]);

  // Auto-scale so the longest horizontal extent = 4.2 game units
  const { scale, yOff } = useMemo(() => {
    cloned.updateMatrixWorld(true);
    const box  = new Box3().setFromObject(cloned);
    const size = new Vector3();
    box.getSize(size);

    const horiz = Math.max(size.x, size.z);
    const s     = horiz > 0 ? 4.2 / horiz : 1.0;
    const y     = isFinite(box.min.y) ? -box.min.y * s : 0;

    return { scale: s, yOff: y };
  }, [cloned]);

  const rotY = CAR_ROT[url] ?? 0;

  return (
    <primitive
      object={cloned}
      scale={[scale, scale, scale]}
      position={[0, yOff, 0]}
      rotation={[0, rotY, 0]}
    />
  );
}

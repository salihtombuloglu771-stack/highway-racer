'use client';
import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import { GameScene } from './GameScene';
import { useGameStore } from '@/store/gameStore';

function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 768;
}

export default function GameCanvas() {
  const isNight = useGameStore(s => s.isNightMode);
  const displaySpeed = useGameStore(s => s.displaySpeed);
  const maxKmh = 60 * 3.2;
  const speedRatio = displaySpeed / maxKmh;
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobileDevice());
  }, []);

  // Mobile: lower quality, no heavy effects
  const dpr: [number, number] = mobile ? [1, 1.5] : [1, 2];
  const shadows = !mobile;

  return (
    <Canvas
      shadows={shadows}
      gl={{
        antialias: !mobile,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      camera={{ fov: 65, near: 0.1, far: mobile ? 400 : 600, position: [0, 3.5, 7] }}
      style={{ width: '100%', height: '100%' }}
      dpr={dpr}
    >
      <Suspense fallback={null}>
        <GameScene isMobile={mobile} />
        {!mobile && (
          <EffectComposer>
            <Bloom
              intensity={isNight ? 1.8 : 0.6}
              luminanceThreshold={isNight ? 0.4 : 0.7}
              luminanceSmoothing={0.4}
              mipmapBlur
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new Vector2(speedRatio * 0.003, speedRatio * 0.003)}
              radialModulation={false}
              modulationOffset={0}
            />
            <Vignette
              offset={0.35}
              darkness={isNight ? 0.9 : 0.5}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        )}
        {mobile && (
          <EffectComposer>
            <Bloom
              intensity={isNight ? 1.2 : 0.4}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.5}
            />
            <Vignette offset={0.4} darkness={0.5} blendFunction={BlendFunction.NORMAL} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}

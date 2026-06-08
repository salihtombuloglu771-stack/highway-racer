'use client';
import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { ACESFilmicToneMapping } from 'three';
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

  const dpr: [number, number] = mobile ? [1, 1.5] : [1, 2];
  const shadows = !mobile;

  return (
    <Canvas
      shadows={shadows}
      gl={{
        antialias: !mobile,
        powerPreference: 'high-performance',
        alpha: false,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: isNight ? 1.0 : 1.3,
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
              intensity={isNight ? 2.0 : 0.7}
              luminanceThreshold={isNight ? 0.35 : 0.65}
              luminanceSmoothing={0.3}
              mipmapBlur
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new Vector2(speedRatio * 0.0025, speedRatio * 0.0025)}
              radialModulation={false}
              modulationOffset={0}
            />
            <Vignette
              offset={0.3}
              darkness={isNight ? 0.85 : 0.45}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        )}
        {mobile && (
          <EffectComposer>
            <Bloom
              intensity={isNight ? 1.4 : 0.45}
              luminanceThreshold={0.55}
              luminanceSmoothing={0.5}
            />
            <Vignette offset={0.4} darkness={0.5} blendFunction={BlendFunction.NORMAL} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}

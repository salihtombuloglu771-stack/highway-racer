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
  const maxKmh = 72 * 3.0;
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
              intensity={isNight ? 2.8 : 1.1}
              luminanceThreshold={isNight ? 0.28 : 0.55}
              luminanceSmoothing={0.25}
              mipmapBlur
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new Vector2(speedRatio * 0.003, speedRatio * 0.003)}
              radialModulation={false}
              modulationOffset={0}
            />
            <Vignette
              offset={0.28}
              darkness={isNight ? 0.9 : 0.5}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        )}
        {mobile && (
          <EffectComposer>
            <Bloom
              intensity={isNight ? 1.8 : 0.65}
              luminanceThreshold={0.45}
              luminanceSmoothing={0.4}
            />
            <Vignette offset={0.35} darkness={0.55} blendFunction={BlendFunction.NORMAL} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}

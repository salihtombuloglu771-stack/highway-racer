'use client';
import { useGameStore } from '@/store/gameStore';
import GameCanvas from '@/game/GameCanvas';
import { HUD } from '@/ui/HUD';
import { MainMenu } from '@/ui/MainMenu';
import { GameOver } from '@/ui/GameOver';
import { PauseMenu } from '@/ui/PauseMenu';
import { InstallBanner } from '@/ui/InstallBanner';
import { GarageMenu } from '@/ui/GarageMenu';

export default function GameApp() {
  const mode = useGameStore(s => s.mode);

  return (
    <div
      className="w-full h-full relative bg-black overflow-hidden"
      style={{ height: '100dvh' }}
    >
      {/* 3D Canvas - always rendered */}
      <GameCanvas />

      {/* Install prompt (mobile only) */}
      {mode === 'menu' && <InstallBanner />}

      {/* UI Overlays */}
      {mode === 'menu' && <MainMenu />}
      {mode === 'playing' && <HUD />}
      {mode === 'paused' && (
        <>
          <HUD />
          <PauseMenu />
        </>
      )}
      {mode === 'gameover' && <GameOver />}
      {mode === 'garage'   && <GarageMenu />}

      {/* Speed lines */}
      <SpeedLines />
    </div>
  );
}

function SpeedLines() {
  const speed = useGameStore(s => s.displaySpeed);
  const maxKmh = 72 * 3.0;
  const ratio = speed / maxKmh;
  if (ratio < 0.65) return null;
  const intensity = (ratio - 0.65) / 0.35;
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity: intensity * 0.35 }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="absolute top-1/2 left-1/2 origin-left h-px bg-white/50"
          style={{
            width: `${25 + (i % 3) * 10}%`,
            transform: `rotate(${(i / 10) * 360}deg) translateY(-50%)`,
          }} />
      ))}
    </div>
  );
}

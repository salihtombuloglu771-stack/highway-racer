'use client';
import { useGameStore } from '@/store/gameStore';
import { useIsMobile } from '@/hooks/useMobile';
import { MobileControls } from './MobileControls';

export function HUD() {
  const { displaySpeed, score, distance, multiplier, cameraMode, setCameraMode, setMode, isNightMode, toggleNight, gameType, timeLeft, nitroLevel } = useGameStore();
  const isMobile = useIsMobile();
  const maxKmh = Math.round(68 * 3.0);
  const speedPct = Math.min(displaySpeed / maxKmh, 1);

  return (
    <div className="absolute inset-0 pointer-events-none select-none">

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-3 md:p-4 pt-4 md:pt-5"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <div className="bg-black/50 backdrop-blur-md rounded-2xl px-3 md:px-4 py-2 border border-white/10">
          <p className="text-white/50 text-[10px] md:text-xs uppercase tracking-wider">Skor</p>
          <p className="text-white font-bold text-lg md:text-2xl tabular-nums">{score.toLocaleString()}</p>
        </div>

        {multiplier > 1 && (
          <div className="bg-rose-600/80 backdrop-blur-md rounded-2xl px-3 py-2 text-white font-black text-lg md:text-xl animate-pulse">
            x{multiplier.toFixed(1)}
          </div>
        )}

        {gameType === 'time' && (
          <div className={`bg-black/50 backdrop-blur-md rounded-2xl px-3 py-2 border ${timeLeft < 10 ? 'border-red-500 animate-pulse' : 'border-white/10'}`}>
            <p className="text-white/50 text-[10px] uppercase tracking-wider">Süre</p>
            <p className={`font-bold text-lg md:text-2xl tabular-nums ${timeLeft < 10 ? 'text-red-400' : 'text-white'}`}>{Math.ceil(timeLeft)}s</p>
          </div>
        )}

        <div className="bg-black/50 backdrop-blur-md rounded-2xl px-3 md:px-4 py-2 border border-white/10">
          <p className="text-white/50 text-[10px] md:text-xs uppercase tracking-wider">Mesafe</p>
          <p className="text-white font-bold text-lg md:text-2xl tabular-nums">{distance.toLocaleString()} <span className="text-xs font-normal">km</span></p>
        </div>
      </div>

      {/* Speed gauge — bottom center */}
      <div className="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <div className="relative w-36 md:w-44 h-20 md:h-24 overflow-hidden">
          <svg viewBox="0 0 176 96" className="absolute inset-0 w-full h-full">
            <path d="M 12 88 A 76 76 0 0 1 164 88" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" strokeLinecap="round" />
            <path
              d="M 12 88 A 76 76 0 0 1 164 88"
              fill="none"
              stroke={displaySpeed > maxKmh * 0.85 ? '#f97316' : displaySpeed > maxKmh * 0.6 ? '#eab308' : '#22d3ee'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${speedPct * 238.76} 238.76`}
              style={{ transition: 'stroke-dasharray 0.1s' }}
            />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-1">
            <span className="text-white font-black text-2xl md:text-3xl tabular-nums leading-none">{displaySpeed}</span>
            <span className="text-white/50 text-[10px] md:text-xs">km/h</span>
          </div>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full transition-colors ${i < Math.ceil(speedPct * 6) ? 'bg-cyan-400' : 'bg-white/20'}`} />
          ))}
        </div>
        {/* Nitro bar */}
        <div className="w-36 md:w-44 mt-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider">⚡ NİTRO</span>
            <span className="text-white/40 text-[9px]">SHIFT</span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-100 ${nitroLevel > 0.5 ? 'bg-cyan-400' : nitroLevel > 0.2 ? 'bg-yellow-400' : 'bg-rose-500'}`}
              style={{ width: `${nitroLevel * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Desktop controls hint */}
      {!isMobile && (
        <div className="absolute bottom-6 left-4 text-white/30 text-xs space-y-0.5">
          <p><kbd className="text-white/50">W/S</kbd> Gaz/Fren · <kbd className="text-white/50">A/D</kbd> Direksiyon</p>
          <p><kbd className="text-white/50">Space</kbd> El Freni · <kbd className="text-white/50">C</kbd> Kamera · <kbd className="text-white/50">N</kbd> Gece</p>
        </div>
      )}

      {/* Desktop action buttons */}
      {!isMobile && (
        <div className="absolute bottom-6 right-4 flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={() => { const n = cameraMode === 'follow' ? 'cockpit' : cameraMode === 'cockpit' ? 'hood' : 'follow'; setCameraMode(n); }}
            className="bg-black/50 border border-white/20 text-white text-xs px-3 py-2 rounded-xl backdrop-blur-md hover:bg-white/10 active:scale-95 transition"
          >
            📷 {cameraMode === 'follow' ? 'Takip' : cameraMode === 'cockpit' ? 'Kokpit' : 'Kaput'}
          </button>
          <button onClick={toggleNight} className="bg-black/50 border border-white/20 text-white text-xs px-3 py-2 rounded-xl backdrop-blur-md hover:bg-white/10 active:scale-95 transition">
            {isNightMode ? '☀️ Gündüz' : '🌙 Gece'}
          </button>
          <button onClick={() => setMode('paused')} className="bg-black/50 border border-white/20 text-white text-xs px-3 py-2 rounded-xl backdrop-blur-md hover:bg-white/10 active:scale-95 transition">
            ⏸ Duraklat
          </button>
        </div>
      )}

      {/* Mobile top-right buttons */}
      {isMobile && (
        <div className="absolute top-16 right-3 flex flex-col gap-2 pointer-events-auto"
          style={{ top: 'calc(env(safe-area-inset-top) + 56px)' }}>
          <button
            onClick={() => setMode('paused')}
            className="w-10 h-10 bg-black/50 border border-white/20 text-white rounded-xl backdrop-blur-md flex items-center justify-center text-base"
          >⏸</button>
          <button
            onClick={toggleNight}
            className="w-10 h-10 bg-black/50 border border-white/20 text-white rounded-xl backdrop-blur-md flex items-center justify-center text-base"
          >{isNightMode ? '☀️' : '🌙'}</button>
        </div>
      )}

      {/* Mobile touch controls */}
      {isMobile && <MobileControls />}
    </div>
  );
}

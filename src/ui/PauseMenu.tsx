'use client';
import { useGameStore } from '@/store/gameStore';

export function PauseMenu() {
  const { setMode, resetGame, score, distance } = useGameStore();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-20">
      <div className="bg-gray-900/95 border border-white/10 rounded-3xl p-8 w-full max-w-xs mx-4 text-center shadow-2xl">
        <h2 className="text-3xl font-black text-white mb-1">DURAKLATILDI</h2>
        <p className="text-white/40 text-sm mb-6">⏸</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 rounded-2xl p-3">
            <p className="text-white/40 text-xs">Skor</p>
            <p className="text-white font-bold text-xl">{score.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3">
            <p className="text-white/40 text-xs">Mesafe</p>
            <p className="text-white font-bold text-xl">{distance} km</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setMode('playing')}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black text-base py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95"
          >
            Devam Et
          </button>
          <button
            onClick={() => { resetGame(); setMode('playing'); }}
            className="w-full bg-white/10 hover:bg-white/15 text-white font-bold text-base py-3 rounded-2xl border border-white/10 transition-all"
          >
            Yeniden Başla
          </button>
          <button
            onClick={() => setMode('menu')}
            className="w-full text-white/50 hover:text-white text-sm py-2 transition-colors"
          >
            Ana Menü
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useGameStore } from '@/store/gameStore';

export function GameOver() {
  const { score, highScore, distance, setMode, resetGame } = useGameStore();
  const isNewRecord = score >= highScore;

  const replay = () => {
    resetGame();
    setMode('playing');
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm z-20">
      <div className="bg-gray-900/90 border border-white/10 rounded-3xl p-8 w-full max-w-sm mx-4 text-center shadow-2xl">

        <div className="text-5xl mb-3">{isNewRecord ? '🏆' : '💥'}</div>

        <h2 className="text-3xl font-black text-white mb-1">
          {isNewRecord ? 'YENİ REKOR!' : 'ÇARPIŞMA!'}
        </h2>
        {isNewRecord && (
          <p className="text-yellow-400 text-sm mb-3 animate-pulse">Tebrikler! Rekorun kırıldı!</p>
        )}

        <div className="grid grid-cols-2 gap-3 my-6">
          <div className="bg-white/5 rounded-2xl p-3">
            <p className="text-white/40 text-xs">Skor</p>
            <p className="text-white font-black text-2xl">{score.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3">
            <p className="text-white/40 text-xs">Mesafe</p>
            <p className="text-white font-black text-2xl">{distance.toLocaleString()} <span className="text-sm font-normal">km</span></p>
          </div>
          <div className="col-span-2 bg-yellow-500/10 border border-yellow-400/20 rounded-2xl p-3">
            <p className="text-yellow-400/70 text-xs">En Yüksek Skor</p>
            <p className="text-yellow-400 font-black text-2xl">{highScore.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={replay}
            className="flex-1 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-black text-base py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95"
          >
            Tekrar Oyna
          </button>
          <button
            onClick={() => setMode('menu')}
            className="flex-1 bg-white/10 hover:bg-white/15 active:bg-white/5 text-white font-bold text-base py-3.5 rounded-2xl border border-white/10 transition-all"
          >
            Menü
          </button>
        </div>
      </div>
    </div>
  );
}

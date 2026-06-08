'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const GameApp = dynamic(() => import('./GameApp'), { ssr: false });

export default function GameAppLoader() {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" />
          <p className="text-white/60 text-sm font-medium">Yükleniyor...</p>
        </div>
      </div>
    }>
      <GameApp />
    </Suspense>
  );
}

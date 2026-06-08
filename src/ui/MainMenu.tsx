'use client';
import { useEffect, useState } from 'react';
import { useGameStore, GameModeType } from '@/store/gameStore';
import { PLAYER_COLORS, CAR_BRANDS, BRAND_NAMES, CarBrand } from '@/utils/constants';
import { useInstallPrompt, isIOS, isAndroid } from '@/hooks/useMobile';

const MODES: { id: GameModeType; label: string; desc: string; icon: string }[] = [
  { id: 'endless', label: 'Sonsuz', desc: 'Uzağa git', icon: '🛣️' },
  { id: 'time', label: 'Zamana Karşı', desc: '60sn en yüksek', icon: '⏱️' },
  { id: 'traffic', label: 'Trafikten Kaç', desc: 'Yoğun trafik', icon: '🚗' },
];

const COLOR_KEYS = Object.keys(PLAYER_COLORS);
const COLOR_NAMES: Record<string, string> = {
  sport: 'Kırmızı', blue: 'Mavi', black: 'Siyah', white: 'Beyaz', yellow: 'Sarı', silver: 'Gümüş',
};

const APK_URL = 'https://github.com/salihtombuloglu771-stack/highway-racer/releases/latest/download/app-release-signed.apk';

export function MainMenu() {
  const { setMode, setGameType, gameType, highScore, selectedColor, setSelectedColor, selectedBrand, setSelectedBrand } = useGameStore();
  const { canInstall, isInstalled, install } = useInstallPrompt();
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (isIOS()) setPlatform('ios');
    else if (isAndroid()) setPlatform('android');
    else setPlatform('desktop');
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black/70 via-black/50 to-black/85 backdrop-blur-sm z-10"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>

      {/* iOS guide modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-end justify-center">
          <div className="bg-gray-900 border border-white/10 rounded-t-3xl w-full max-w-sm p-6 pb-10">
            <h3 className="text-white font-bold text-lg mb-4 text-center">📱 iPhone'a Yükle</h3>
            <div className="space-y-4 text-sm">
              {[
                ["Safari'nin alt menüsünden", "Paylaş butonuna bas (□↑)"],
                ["Listeden", '"Ana Ekrana Ekle" seç'],
                ["Sağ üstten", '"Ekle"ye bas — tam ekran açılır!'],
              ].map(([pre, bold], i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold shrink-0 text-sm">{i + 1}</span>
                  <p className="text-white/80">{pre} <strong className="text-white">{bold}</strong></p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowIOSGuide(false)} className="w-full mt-6 py-3 bg-white/10 text-white rounded-xl font-medium">
              Tamam
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="text-center mb-5">
        <div className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
          HIGHWAY<br />
          <span className="text-rose-500">RACER</span>
          <span className="text-white"> 3D</span>
        </div>
        {highScore > 0 && (
          <p className="text-yellow-400/80 text-sm mt-2">🏆 Rekor: {highScore.toLocaleString()}</p>
        )}
      </div>

      {/* Game modes */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs md:max-w-md px-4 mb-4">
        {MODES.map(m => (
          <button key={m.id} onClick={() => setGameType(m.id)}
            className={`rounded-2xl p-2.5 border transition-all text-center ${gameType === m.id ? 'bg-rose-600/80 border-rose-400/50 shadow-lg shadow-rose-500/20' : 'bg-white/5 border-white/10 active:bg-white/10'}`}>
            <div className="text-xl mb-0.5">{m.icon}</div>
            <p className="text-white text-[10px] md:text-xs font-bold leading-tight">{m.label}</p>
            <p className="text-white/40 text-[9px] md:text-[10px] mt-0.5 leading-tight hidden md:block">{m.desc}</p>
          </button>
        ))}
      </div>

      {/* Car brand */}
      <div className="mb-3 px-4 w-full max-w-xs md:max-w-md">
        <p className="text-white/50 text-[10px] text-center uppercase tracking-wider mb-2">Araç Markası</p>
        <div className="grid grid-cols-4 gap-2">
          {CAR_BRANDS.map(brand => (
            <button key={brand} onClick={() => setSelectedBrand(brand as CarBrand)}
              className={`rounded-xl py-2 px-1 border transition-all text-center ${selectedBrand === brand ? 'bg-rose-600/80 border-rose-400/50 shadow-lg shadow-rose-500/20' : 'bg-white/5 border-white/10 active:bg-white/10'}`}>
              <div className="text-lg leading-none mb-0.5">
                {brand === 'bmw' ? '🔵' : brand === 'mercedes' ? '⭐' : brand === 'audi' ? '⚪' : '🇹🇷'}
              </div>
              <p className="text-white text-[10px] font-bold leading-tight">{BRAND_NAMES[brand as CarBrand]}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Car color */}
      <div className="mb-4 px-4">
        <p className="text-white/50 text-[10px] text-center uppercase tracking-wider mb-2">Araç Rengi</p>
        <div className="flex justify-center gap-2.5">
          {COLOR_KEYS.map(key => (
            <button key={key} onClick={() => setSelectedColor(key)} title={COLOR_NAMES[key]}
              className={`w-8 h-8 md:w-9 md:h-9 rounded-full border-2 transition-all ${selectedColor === key ? 'border-white scale-110 shadow-lg' : 'border-white/20'}`}
              style={{ backgroundColor: PLAYER_COLORS[key] }} />
          ))}
        </div>
      </div>

      {/* Start */}
      <button onClick={() => setMode('playing')}
        className="bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-black text-xl px-10 py-4 rounded-2xl transition-all active:scale-95 shadow-xl shadow-rose-500/30 mb-4">
        OYNA 🚗
      </button>

      {/* Install section */}
      {!isInstalled && (
        <div className="flex gap-2 px-4">
          {platform === 'ios' && (
            <button onClick={() => setShowIOSGuide(true)}
              className="flex items-center gap-2 bg-white/10 border border-white/10 text-white text-xs font-medium px-4 py-2.5 rounded-xl active:bg-white/20">
              <span>🍎</span> iPhone'a Ekle
            </button>
          )}
          {platform === 'android' && canInstall && (
            <button onClick={install}
              className="flex items-center gap-2 bg-green-600/80 border border-green-500/30 text-white text-xs font-bold px-4 py-2.5 rounded-xl active:bg-green-500">
              <span>🤖</span> Uygulamayı Yükle
            </button>
          )}
          {platform === 'android' && !canInstall && (
            <a href={APK_URL}
              className="flex items-center gap-2 bg-green-700/70 border border-green-500/30 text-white text-xs font-bold px-4 py-2.5 rounded-xl active:bg-green-600">
              <span>📥</span> APK İndir
            </a>
          )}
          {platform === 'desktop' && (
            <p className="text-white/30 text-xs text-center">
              Mobil için tarayıcıda aç → Ana Ekrana Ekle
            </p>
          )}
        </div>
      )}

      {/* Desktop controls */}
      {platform === 'desktop' && (
        <p className="text-white/25 text-[10px] text-center mt-3 px-4">
          W/S · A/D · SPACE el freni · C kamera · N gece · ESC duraklat
        </p>
      )}
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useInstallPrompt, isIOS, isAndroid } from '@/hooks/useMobile';

const APK_URL = 'https://github.com/YOUR_USER/highway-racer/releases/latest/download/highway-racer.apk';

export function InstallBanner() {
  const { canInstall, isInstalled, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | null>(null);

  useEffect(() => {
    if (isIOS()) setPlatform('ios');
    else if (isAndroid()) setPlatform('android');
  }, []);

  if (isInstalled || dismissed || !platform) return null;

  return (
    <>
      {/* iOS guide modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-gray-900 border border-white/10 rounded-t-3xl w-full max-w-sm p-6 pb-10">
            <h3 className="text-white font-bold text-lg mb-4 text-center">iPhone'a Yükle</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">1</span>
                <p className="text-white/80">Safari'nin alt menüsünden <strong className="text-white">Paylaş</strong> butonuna bas (kare + ok ikonu)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">2</span>
                <p className="text-white/80"><strong className="text-white">"Ana Ekrana Ekle"</strong> seçeneğini seç</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">3</span>
                <p className="text-white/80">Sağ üstten <strong className="text-white">Ekle</strong>'ye bas — artık uygulama gibi açılır!</p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full mt-6 py-3 bg-white/10 text-white rounded-xl font-medium"
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gray-950/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center gap-3"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shrink-0 text-xl">🚗</div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-tight">Highway Racer 3D</p>
          <p className="text-white/50 text-xs leading-tight">
            {platform === 'ios' ? 'Ana ekrana ekle' : 'Uygulamayı yükle'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {platform === 'ios' && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl active:bg-rose-700"
            >
              Nasıl?
            </button>
          )}
          {platform === 'android' && canInstall && (
            <button
              onClick={install}
              className="bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl active:bg-rose-700"
            >
              Yükle
            </button>
          )}
          {platform === 'android' && !canInstall && (
            <a
              href={APK_URL}
              className="bg-green-600 text-white text-xs font-bold px-3 py-2 rounded-xl active:bg-green-700 flex items-center gap-1"
            >
              APK ↓
            </a>
          )}
          <button onClick={() => setDismissed(true)} className="p-1 text-white/40">
            ✕
          </button>
        </div>
      </div>
    </>
  );
}

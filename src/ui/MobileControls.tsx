'use client';
import { useRef, useEffect } from 'react';

function dispatch(type: 'keydown' | 'keyup', code: string) {
  window.dispatchEvent(new KeyboardEvent(type, { code, bubbles: true }));
}

interface TouchBtn {
  code: string;
  label: string;
  className: string;
  style?: React.CSSProperties;
}

function TouchButton({ code, label, className, style }: TouchBtn) {
  return (
    <button
      className={className}
      style={style}
      onTouchStart={e => { e.preventDefault(); dispatch('keydown', code); }}
      onTouchEnd={e => { e.preventDefault(); dispatch('keyup', code); }}
      onMouseDown={() => dispatch('keydown', code)}
      onMouseUp={() => dispatch('keyup', code)}
      onMouseLeave={() => dispatch('keyup', code)}
    >
      {label}
    </button>
  );
}

export function MobileControls() {
  const steerRef = useRef<HTMLDivElement>(null);
  const steerStartX = useRef<number | null>(null);
  const steerLeft = useRef(false);
  const steerRight = useRef(false);

  useEffect(() => {
    const el = steerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      steerStartX.current = e.touches[0].clientX;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (steerStartX.current === null) return;
      const dx = e.touches[0].clientX - steerStartX.current;
      const threshold = 15;

      if (dx < -threshold && !steerLeft.current) {
        steerLeft.current = true;
        steerRight.current = false;
        dispatch('keydown', 'ArrowLeft');
        dispatch('keyup', 'ArrowRight');
      } else if (dx > threshold && !steerRight.current) {
        steerRight.current = true;
        steerLeft.current = false;
        dispatch('keydown', 'ArrowRight');
        dispatch('keyup', 'ArrowLeft');
      } else if (Math.abs(dx) <= threshold) {
        if (steerLeft.current) { dispatch('keyup', 'ArrowLeft'); steerLeft.current = false; }
        if (steerRight.current) { dispatch('keyup', 'ArrowRight'); steerRight.current = false; }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      steerStartX.current = null;
      if (steerLeft.current) { dispatch('keyup', 'ArrowLeft'); steerLeft.current = false; }
      if (steerRight.current) { dispatch('keyup', 'ArrowRight'); steerRight.current = false; }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Steering zone — left 60% of screen, swipe left/right */}
      <div
        ref={steerRef}
        className="absolute left-0 top-0 bottom-0 pointer-events-auto"
        style={{ width: '60%' }}
      >
        {/* Visual hint arrows */}
        <div className="absolute bottom-8 left-4 flex gap-3">
          <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl">
            ◀
          </div>
          <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl">
            ▶
          </div>
        </div>
        <p className="absolute bottom-28 left-6 text-white/30 text-xs">← Sürükle →</p>
      </div>

      {/* Gas + Brake — right 40% */}
      <div className="absolute right-0 top-0 bottom-0 flex flex-col items-center justify-end pb-6 gap-3 pointer-events-auto" style={{ width: '40%' }}>
        <TouchButton
          code="ArrowDown"
          label="FREN"
          className="w-20 h-16 rounded-2xl bg-yellow-500/70 border border-yellow-400/40 backdrop-blur-sm text-white font-black text-sm active:bg-yellow-400 transition-colors"
        />
        <TouchButton
          code="ArrowUp"
          label="GAZ"
          className="w-24 h-20 rounded-2xl bg-rose-600/80 border border-rose-400/40 backdrop-blur-sm text-white font-black text-base active:bg-rose-500 transition-colors"
        />
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import {
  useGameStore, UPGRADE_COSTS, MAX_UPGRADE_LEVEL, Upgrades,
  CAR_NAMES, CAR_PRICES, CAR_EMOJIS, CAR_DESCS, CAR_STATS, CarModel,
} from '@/store/gameStore';
import { MAX_SPEED, SPEED_TO_KMH } from '@/utils/constants';
import { playCoin } from '@/hooks/useGameSounds';

const UPGRADE_ITEMS: { key: keyof Upgrades; label: string; icon: string; desc: string }[] = [
  { key: 'speed',    label: 'HIZ',     icon: '🏎️', desc: 'Maksimum hız' },
  { key: 'nitro',    label: 'NİTRO',   icon: '⚡', desc: 'Nitro gücü'  },
  { key: 'handling', label: 'KONTROL', icon: '🎯', desc: 'Direksiyon hassasiyeti' },
];

const CAR_ORDER: CarModel[] = ['sport', 'classic', 'muscle', 'electric', 'hypercar'];

function effectiveValue(type: keyof Upgrades, level: number): string {
  switch (type) {
    case 'speed':    return `${Math.round(MAX_SPEED * (1 + level * 0.12) * SPEED_TO_KMH)} km/h`;
    case 'nitro':    return `+${Math.round(level * 15)}%`;
    case 'handling': return `+${Math.round(level * 10)}%`;
  }
}

function StatBar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i < value ? 'bg-rose-500' : 'bg-white/15'}`}
        />
      ))}
    </div>
  );
}

export function GarageMenu() {
  const {
    setMode, totalCoins, upgrades, buyUpgrade,
    selectedCarModel, ownedCarModels, setCarModel, buyCarModel,
    selectedColor,
  } = useGameStore();
  const [tab, setTab] = useState<'cars' | 'upgrades'>('cars');

  return (
    <div
      className="absolute inset-0 flex flex-col items-center z-10 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(8,8,24,0.97) 100%)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="w-full max-w-md px-4 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-3xl font-black text-white tracking-tight">GARAJ</h1>
          <div className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-3 py-1.5">
            <span className="text-lg">🪙</span>
            <span className="text-yellow-400 font-black text-xl">{totalCoins.toLocaleString()}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['cars', 'upgrades'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl font-black text-sm transition-all ${
                tab === t
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-white/8 text-white/50 hover:bg-white/12'
              }`}
            >
              {t === 'cars' ? '🚗 ARAÇLAR' : '⚡ YÜKSELTME'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable content ─────────────────────────── */}
      <div className="flex-1 overflow-y-auto w-full max-w-md px-4 pb-4">

        {/* ── CARS TAB ─────────────────────────────────── */}
        {tab === 'cars' && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            {CAR_ORDER.map(model => {
              const owned    = ownedCarModels.includes(model);
              const selected = selectedCarModel === model;
              const price    = CAR_PRICES[model];
              const canAfford= totalCoins >= price;
              const [spd, hdl, pwr] = CAR_STATS[model];

              return (
                <div
                  key={model}
                  className={`relative rounded-2xl p-3 border transition-all ${
                    selected
                      ? 'bg-rose-600/20 border-rose-500/60 shadow-lg shadow-rose-500/20'
                      : owned
                      ? 'bg-white/6 border-white/15'
                      : 'bg-white/4 border-white/8'
                  }`}
                >
                  {/* Selected badge */}
                  {selected && (
                    <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      SEÇİLİ
                    </div>
                  )}

                  {/* Emoji */}
                  <div className="text-4xl text-center mb-1">{CAR_EMOJIS[model]}</div>

                  {/* Color swatch (only for selected) */}
                  {selected && (
                    <div
                      className="w-full h-1 rounded-full mb-2 opacity-80"
                      style={{ background: selectedColor }}
                    />
                  )}

                  {/* Name + desc */}
                  <p className="text-white font-black text-sm text-center leading-tight">
                    {CAR_NAMES[model]}
                  </p>
                  <p className="text-white/40 text-[10px] text-center mb-2 leading-tight">
                    {CAR_DESCS[model]}
                  </p>

                  {/* Stats */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/40 text-[9px] w-10">HIZ</span>
                      <StatBar value={spd} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/40 text-[9px] w-10">GÜÇ</span>
                      <StatBar value={pwr} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/40 text-[9px] w-10">KONT.</span>
                      <StatBar value={hdl} />
                    </div>
                  </div>

                  {/* Action button */}
                  {selected ? (
                    <button
                      disabled
                      className="w-full py-1.5 rounded-xl bg-rose-600/40 text-rose-300 font-black text-xs cursor-default"
                    >
                      ★ SEÇİLİ
                    </button>
                  ) : owned ? (
                    <button
                      onClick={() => setCarModel(model)}
                      className="w-full py-1.5 rounded-xl bg-white/10 hover:bg-white/18 text-white font-black text-xs active:scale-95 transition-all"
                    >
                      SEÇ
                    </button>
                  ) : (
                    <button
                      onClick={() => { if (buyCarModel(model)) playCoin(); }}
                      disabled={!canAfford}
                      className={`w-full py-1.5 rounded-xl font-black text-xs active:scale-95 transition-all ${
                        canAfford
                          ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-500/25'
                          : 'bg-white/8 text-white/30 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? `🪙 ${price}` : `🔒 ${price}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── UPGRADES TAB ─────────────────────────────── */}
        {tab === 'upgrades' && (
          <div className="flex flex-col gap-3 pt-1">
            {UPGRADE_ITEMS.map(({ key, label, icon, desc }) => {
              const level     = upgrades[key];
              const maxed     = level >= MAX_UPGRADE_LEVEL;
              const cost      = maxed ? 0 : UPGRADE_COSTS[key][level];
              const canAfford = !maxed && totalCoins >= cost;

              return (
                <div
                  key={key}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4"
                >
                  <div className="text-3xl w-10 text-center">{icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-black text-sm">{label}</span>
                      <span className="text-white/40 text-xs">{desc}</span>
                    </div>
                    <div className="flex gap-1 mb-1">
                      {Array.from({ length: MAX_UPGRADE_LEVEL }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full ${i < level ? 'bg-rose-500' : 'bg-white/15'}`}
                        />
                      ))}
                    </div>
                    <span className="text-cyan-400 text-xs font-bold">{effectiveValue(key, level)}</span>
                  </div>
                  <button
                    onClick={() => { if (buyUpgrade(key)) playCoin(); }}
                    disabled={maxed || !canAfford}
                    className={`px-3 py-2 rounded-xl font-black text-sm min-w-[64px] transition-all active:scale-95 ${
                      maxed
                        ? 'bg-white/10 text-white/30 cursor-default'
                        : canAfford
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-500'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {maxed ? 'MAX' : <span className="flex items-center gap-1">🪙<span>{cost}</span></span>}
                  </button>
                </div>
              );
            })}
            <p className="text-white/30 text-xs text-center pt-1">
              Coin: geçiş +1 · yaklaşma +2 · tehlikeli +5
            </p>
          </div>
        )}
      </div>

      {/* ── Back button ────────────────────────────────── */}
      <div className="w-full max-w-md px-4 pb-4 flex-shrink-0">
        <button
          onClick={() => setMode('menu')}
          className="w-full bg-white/10 border border-white/20 text-white font-bold text-base py-3 rounded-2xl hover:bg-white/15 active:scale-95 transition-all"
        >
          ← Geri
        </button>
      </div>
    </div>
  );
}

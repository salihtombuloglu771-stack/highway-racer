'use client';
import { create } from 'zustand';

export type GameMode = 'menu' | 'playing' | 'paused' | 'gameover' | 'garage';
export type CameraMode = 'follow' | 'cockpit' | 'hood';
export type GameModeType = 'endless' | 'time' | 'traffic';
export type CarBrand = 'bmw' | 'mercedes' | 'audi' | 'tofas';

interface GameStore {
  mode: GameMode;
  cameraMode: CameraMode;
  gameType: GameModeType;
  displaySpeed: number;
  score: number;
  highScore: number;
  distance: number;
  multiplier: number;
  coins: number;
  isNightMode: boolean;
  selectedColor: string;
  selectedBrand: CarBrand;
  crashed: boolean;
  timeLeft: number;

  setMode: (m: GameMode) => void;
  setCameraMode: (m: CameraMode) => void;
  setGameType: (m: GameModeType) => void;
  updateHUD: (speed: number, score: number, dist: number, mult: number, coins: number) => void;
  setGameOver: (score: number) => void;
  resetGame: () => void;
  toggleNight: () => void;
  setSelectedColor: (c: string) => void;
  setSelectedBrand: (b: CarBrand) => void;
  tickTime: (dt: number) => void;
}

const safeGet = (key: string, fallback: string) => {
  if (typeof window === 'undefined') return fallback;
  return localStorage.getItem(key) ?? fallback;
};

export const useGameStore = create<GameStore>((set, get) => ({
  mode: 'menu',
  cameraMode: 'follow',
  gameType: 'endless',
  displaySpeed: 0,
  score: 0,
  highScore: parseInt(safeGet('hr_highscore', '0')),
  distance: 0,
  multiplier: 1,
  coins: parseInt(safeGet('hr_coins', '0')),
  isNightMode: false,
  selectedColor: 'sport',
  selectedBrand: 'bmw' as CarBrand,
  crashed: false,
  timeLeft: 60,

  setMode: (mode) => set({ mode }),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  setGameType: (gameType) => {
    const timeLeft = gameType === 'time' ? 60 : 0;
    set({ gameType, timeLeft });
  },
  updateHUD: (displaySpeed, score, distance, multiplier, coins) =>
    set({ displaySpeed, score, distance, multiplier, coins }),
  setGameOver: (score) => {
    const hs = Math.max(get().highScore, score);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hr_highscore', String(hs));
      localStorage.setItem('hr_coins', String(get().coins));
    }
    set({ mode: 'gameover', highScore: hs, crashed: true });
  },
  resetGame: () => set(s => ({
    score: 0,
    distance: 0,
    displaySpeed: 0,
    multiplier: 1,
    crashed: false,
    timeLeft: s.gameType === 'time' ? 60 : 0,
  })),
  toggleNight: () => set(s => ({ isNightMode: !s.isNightMode })),
  setSelectedColor: (c) => set({ selectedColor: c }),
  setSelectedBrand: (b) => set({ selectedBrand: b }),
  tickTime: (dt) => {
    if (get().gameType !== 'time') return;
    const t = get().timeLeft - dt;
    if (t <= 0) get().setGameOver(get().score);
    else set({ timeLeft: t });
  },
}));

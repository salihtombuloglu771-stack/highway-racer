'use client';
import { create } from 'zustand';

export type GameMode     = 'menu' | 'playing' | 'paused' | 'gameover' | 'garage';
export type CameraMode   = 'follow' | 'orbit' | 'cockpit' | 'hood';
export type GameModeType = 'endless' | 'time' | 'traffic';
export type CarBrand     = 'bmw' | 'mercedes' | 'audi' | 'tofas';
export type CarModel = 'sport' | 'classic' | 'muscle' | 'electric' | 'hypercar';

export const CAR_PRICES: Record<CarModel, number> = {
  sport:    0,
  classic:  80,
  muscle:   150,
  electric: 250,
  hypercar: 400,
};
export const CAR_NAMES: Record<CarModel, string> = {
  sport:    'Spor',
  classic:  'Klasik',
  muscle:   'Muscle',
  electric: 'Elektrik',
  hypercar: 'Hypercar',
};
export const CAR_EMOJIS: Record<CarModel, string> = {
  sport:    '🏎️',
  classic:  '🚗',
  muscle:   '💪',
  electric: '⚡',
  hypercar: '🚀',
};
export const CAR_DESCS: Record<CarModel, string> = {
  sport:    'Dengeli spor sedan',
  classic:  '70ler retro klasiği',
  muscle:   'Uzun kaput, güç',
  electric: 'Fütürist, tam elektrik',
  hypercar: 'En hızlı süperkar',
};
export const CAR_STATS: Record<CarModel, [number, number, number]> = {
  sport:    [3, 4, 3],
  classic:  [2, 2, 2],
  muscle:   [4, 2, 5],
  electric: [5, 4, 4],
  hypercar: [5, 3, 5],
};

export interface Upgrades {
  speed:    number; // 0-4, +12% max speed per level
  nitro:    number; // 0-4, +15% nitro speed per level
  handling: number; // 0-4, +10% turn rate per level
}

// Coin cost to reach the next level (index = current level)
export const UPGRADE_COSTS: Record<keyof Upgrades, number[]> = {
  speed:    [25,  75,  150, 300],
  nitro:    [30,  90,  200, 400],
  handling: [20,  60,  130, 260],
};
export const MAX_UPGRADE_LEVEL = 4;

interface GameStore {
  mode:          GameMode;
  cameraMode:    CameraMode;
  gameType:      GameModeType;
  displaySpeed:  number;
  score:         number;
  highScore:     number;
  distance:      number;
  multiplier:    number;
  coins:         number;
  totalCoins:    number; // persistent bank
  isNightMode:   boolean;
  selectedColor: string;
  selectedBrand: CarBrand;
  crashed:       boolean;
  timeLeft:      number;
  nitroLevel:    number;
  upgrades:          Upgrades;
  bonusPopup:        string;
  bonusPopupKey:     number;
  selectedCarModel:  CarModel;
  ownedCarModels:    CarModel[];

  setMode:          (m: GameMode) => void;
  setCameraMode:    (m: CameraMode) => void;
  setGameType:      (m: GameModeType) => void;
  updateHUD:        (speed: number, score: number, dist: number, mult: number, coins: number, nitro?: number) => void;
  setGameOver:      (score: number) => void;
  resetGame:        () => void;
  toggleNight:      () => void;
  setSelectedColor: (c: string) => void;
  setSelectedBrand: (b: CarBrand) => void;
  tickTime:         (dt: number) => void;
  showBonusPopup:   (text: string) => void;
  buyUpgrade:       (type: keyof Upgrades) => boolean;
  setCarModel:      (m: CarModel) => void;
  buyCarModel:      (m: CarModel) => boolean;
}

const safeGet  = (key: string, fallback: string) =>
  typeof window === 'undefined' ? fallback : (localStorage.getItem(key) ?? fallback);
const safeGetN = (key: string, fallback: number) =>
  parseInt(safeGet(key, String(fallback)));

function loadUpgrades(): Upgrades {
  return {
    speed:    safeGetN('hr_upg_speed',    0),
    nitro:    safeGetN('hr_upg_nitro',    0),
    handling: safeGetN('hr_upg_handling', 0),
  };
}

function loadOwnedCars(): CarModel[] {
  if (typeof window === 'undefined') return ['sport'];
  try {
    const raw = localStorage.getItem('hr_owned_cars');
    if (!raw) return ['sport'];
    return JSON.parse(raw) as CarModel[];
  } catch { return ['sport']; }
}

function loadCarModel(): CarModel {
  const raw = safeGet('hr_car_model', 'sport');
  return raw as CarModel;
}

export const useGameStore = create<GameStore>((set, get) => ({
  mode:          'menu',
  cameraMode:    'follow',
  gameType:      'endless',
  displaySpeed:  0,
  score:         0,
  highScore:     safeGetN('hr_highscore', 0),
  distance:      0,
  multiplier:    1,
  coins:         0,
  totalCoins:    safeGetN('hr_coins', 0),
  isNightMode:   false,
  selectedColor: 'sport',
  selectedBrand: 'bmw' as CarBrand,
  crashed:       false,
  timeLeft:      60,
  nitroLevel:    1,
  upgrades:         loadUpgrades(),
  bonusPopup:       '',
  bonusPopupKey:    0,
  selectedCarModel: loadCarModel(),
  ownedCarModels:   loadOwnedCars(),

  setMode:       (mode)       => set({ mode }),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  setGameType:   (gameType)   => set({ gameType, timeLeft: gameType === 'time' ? 60 : 0 }),

  updateHUD: (displaySpeed, score, distance, multiplier, coins, nitro) =>
    set({ displaySpeed, score, distance, multiplier, coins, ...(nitro !== undefined ? { nitroLevel: nitro } : {}) }),

  setGameOver: (score) => {
    const hs    = Math.max(get().highScore, score);
    const total = get().totalCoins + get().coins;
    if (typeof window !== 'undefined') {
      localStorage.setItem('hr_highscore', String(hs));
      localStorage.setItem('hr_coins',     String(total));
    }
    set({ mode: 'gameover', highScore: hs, crashed: true, totalCoins: total });
  },

  resetGame: () => set(s => ({
    score: 0, distance: 0, displaySpeed: 0, multiplier: 1, coins: 0,
    crashed: false, timeLeft: s.gameType === 'time' ? 60 : 0,
  })),

  toggleNight:      () => set(s => ({ isNightMode: !s.isNightMode })),
  setSelectedColor: (c) => set({ selectedColor: c }),
  setSelectedBrand: (b) => set({ selectedBrand: b }),

  tickTime: (dt) => {
    if (get().gameType !== 'time') return;
    const t = get().timeLeft - dt;
    if (t <= 0) get().setGameOver(get().score);
    else set({ timeLeft: t });
  },

  showBonusPopup: (text) => set(s => ({ bonusPopup: text, bonusPopupKey: s.bonusPopupKey + 1 })),

  buyUpgrade: (type) => {
    const { upgrades, totalCoins } = get();
    const level = upgrades[type];
    if (level >= MAX_UPGRADE_LEVEL) return false;
    const cost = UPGRADE_COSTS[type][level];
    if (totalCoins < cost) return false;
    const newTotal    = totalCoins - cost;
    const newUpgrades = { ...upgrades, [type]: level + 1 };
    if (typeof window !== 'undefined') {
      localStorage.setItem('hr_coins',           String(newTotal));
      localStorage.setItem(`hr_upg_${type}`,     String(level + 1));
    }
    set({ totalCoins: newTotal, upgrades: newUpgrades });
    return true;
  },

  setCarModel: (m) => {
    if (typeof window !== 'undefined') localStorage.setItem('hr_car_model', m);
    set({ selectedCarModel: m });
  },

  buyCarModel: (m) => {
    const { totalCoins, ownedCarModels } = get();
    if (ownedCarModels.includes(m)) { get().setCarModel(m); return true; }
    const cost = CAR_PRICES[m];
    if (totalCoins < cost) return false;
    const newTotal = totalCoins - cost;
    const newOwned = [...ownedCarModels, m];
    if (typeof window !== 'undefined') {
      localStorage.setItem('hr_coins',      String(newTotal));
      localStorage.setItem('hr_owned_cars', JSON.stringify(newOwned));
      localStorage.setItem('hr_car_model',  m);
    }
    set({ totalCoins: newTotal, ownedCarModels: newOwned, selectedCarModel: m });
    return true;
  },
}));

export const LANE_COUNT = 4;
export const LANE_WIDTH = 3.5;
export const ROAD_WIDTH = LANE_COUNT * LANE_WIDTH; // 14
export const LANE_POSITIONS = [-5.25, -1.75, 1.75, 5.25];

export const SEGMENT_LENGTH = 200;
export const SEGMENT_COUNT = 8;
export const TOTAL_ROAD = SEGMENT_COUNT * SEGMENT_LENGTH;

// Physics
export const MAX_SPEED      = 68;
export const ACCELERATION   = 24;
export const BRAKING        = 40;
export const FRICTION       = 8;
export const MAX_STEERING   = 1.0;
export const STEERING_SPEED = 5.5;
export const TURN_RATE      = 6.0;  // units/s lateral at full steer + full speed

// Nitro boost
export const NITRO_MAX_SPEED   = 105;  // ~315 km/h display
export const NITRO_DRAIN       = 0.32; // depletes in ~3.1s
export const NITRO_RECHARGE    = 0.16; // recharges in ~6.3s

// Display conversion (km/h at MAX_SPEED = 204)
export const SPEED_TO_KMH = 3.0;

// Traffic
export const MAX_TRAFFIC      = 26;
export const TRAFFIC_MIN_SPEED = 16;
export const TRAFFIC_MAX_SPEED = 50;

// Scoring
export const NEAR_MISS_X = 3.2;
export const NEAR_MISS_Z = 5.0;
export const COLLISION_X = 1.7;
export const COLLISION_Z = 3.5;

export const TRAFFIC_TYPES = ['sedan', 'suv', 'truck', 'bus', 'sport'] as const;
export type TrafficType = (typeof TRAFFIC_TYPES)[number];

export const TRAFFIC_COLORS = [
  '#2563eb', '#16a34a', '#ca8a04', '#9333ea',
  '#0891b2', '#dc2626', '#f97316', '#475569', '#ffffff', '#111827',
];

export const PLAYER_COLORS: Record<string, string> = {
  sport:  '#e11d48',
  blue:   '#2563eb',
  black:  '#111',
  white:  '#f9fafb',
  yellow: '#eab308',
  silver: '#94a3b8',
};

export const CAR_BRANDS = ['bmw', 'mercedes', 'audi', 'tofas'] as const;
export type CarBrand = (typeof CAR_BRANDS)[number];

export const BRAND_NAMES: Record<CarBrand, string> = {
  bmw:      'BMW',
  mercedes: 'Mercedes',
  audi:     'Audi',
  tofas:    'Tofaş',
};

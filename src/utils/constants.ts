export const LANE_COUNT = 4;
export const LANE_WIDTH = 3.5;
export const ROAD_WIDTH = LANE_COUNT * LANE_WIDTH; // 14
export const LANE_POSITIONS = [-5.25, -1.75, 1.75, 5.25];

export const SEGMENT_LENGTH = 200;
export const SEGMENT_COUNT = 8;
export const TOTAL_ROAD = SEGMENT_COUNT * SEGMENT_LENGTH;

// Physics
export const MAX_SPEED = 60;
export const ACCELERATION = 20;
export const BRAKING = 35;
export const FRICTION = 7;
export const MAX_STEERING = 1.0;
export const STEERING_SPEED = 3.5;
export const TURN_RATE = 2.2;

// Display conversion
export const SPEED_TO_KMH = 3.2;

// Traffic
export const MAX_TRAFFIC = 22;
export const TRAFFIC_MIN_SPEED = 15;
export const TRAFFIC_MAX_SPEED = 48;

// Scoring
export const NEAR_MISS_X = 3.2;
export const NEAR_MISS_Z = 5.0;
export const COLLISION_X = 1.8;
export const COLLISION_Z = 3.8;

export const TRAFFIC_TYPES = ['sedan', 'suv', 'truck', 'bus', 'sport'] as const;
export type TrafficType = (typeof TRAFFIC_TYPES)[number];

export const TRAFFIC_COLORS = [
  '#2563eb', '#16a34a', '#ca8a04', '#9333ea',
  '#0891b2', '#dc2626', '#f97316', '#475569', '#ffffff', '#111827',
];

export const PLAYER_COLORS: Record<string, string> = {
  sport: '#e11d48',
  blue: '#2563eb',
  black: '#111',
  white: '#f9fafb',
  yellow: '#eab308',
  silver: '#94a3b8',
};

export const CAR_BRANDS = ['bmw', 'mercedes', 'audi', 'tofas'] as const;
export type CarBrand = (typeof CAR_BRANDS)[number];

export const BRAND_NAMES: Record<CarBrand, string> = {
  bmw: 'BMW',
  mercedes: 'Mercedes',
  audi: 'Audi',
  tofas: 'Tofaş',
};

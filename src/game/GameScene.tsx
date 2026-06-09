'use client';
import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, PerspectiveCamera, MathUtils } from 'three';
import { useGameStore } from '@/store/gameStore';
import { useInput } from '@/hooks/useInput';
import { PlayerCarMesh } from '@/components/cars/PlayerCarMesh';
import { TrafficCarMesh } from '@/components/cars/TrafficCarMesh';
import { RoadSegmentMesh } from '@/components/road/RoadSegmentMesh';
import { Environment } from '@/components/environment/Environment';
import { Environment as IBL } from '@react-three/drei';
import {
  initAudio, stopEngine, updateEngine, playCrash, playWhoosh, playCoin,
} from '@/hooks/useGameSounds';
import {
  MAX_SPEED, ACCELERATION, BRAKING, FRICTION, MAX_STEERING, STEERING_SPEED, TURN_RATE,
  NITRO_MAX_SPEED, NITRO_DRAIN, NITRO_RECHARGE,
  SEGMENT_LENGTH, SEGMENT_COUNT, SPEED_TO_KMH,
  LANE_POSITIONS, LANE_COUNT,
  ONCOMING_LANES, ONCOMING_LANE_COUNT,
  MAX_TRAFFIC, TRAFFIC_MIN_SPEED, TRAFFIC_MAX_SPEED,
  MAX_ONCOMING, ONCOMING_MIN_SPEED, ONCOMING_MAX_SPEED,
  TRAFFIC_COLORS,
  NEAR_MISS_X, NEAR_MISS_Z, COLLISION_X, COLLISION_Z,
  NEAR_MISS_BONUS, ONCOMING_NEAR_MISS_BONUS, OVERTAKE_BONUS,
  PLAYER_MIN_X, PLAYER_MAX_X, PLAYER_START_X,
  TrafficType,
} from '@/utils/constants';

interface GameSceneProps { isMobile?: boolean }

interface TrafficCar {
  id: number;
  type: TrafficType;
  color: string;
  lane: number;
  targetLane: number;
  x: number;
  z: number;
  speed: number;
  changeCooldown: number;
  width: number;
  length: number;
  passed: boolean;
}

interface OncomingCar {
  id: number;
  type: TrafficType;
  color: string;
  lane: number;
  x: number;
  z: number;
  speed: number;
  width: number;
  length: number;
}

function getCarDims(type: TrafficType): { width: number; length: number } {
  switch (type) {
    case 'truck': return { width: 2.3, length: 12 };
    case 'bus':   return { width: 2.3, length: 8.5 };
    case 'suv':   return { width: 2.1, length: 4.5 };
    case 'sport': return { width: 2.3, length: 4.6 };
    default:      return { width: 2.0, length: 4.2 };
  }
}

function randomLane()         { return Math.floor(Math.random() * LANE_COUNT); }
function randomOncomingLane() { return Math.floor(Math.random() * ONCOMING_LANE_COUNT); }
function randomTrafficType(): TrafficType {
  // Weighted: sedan 33%, suv 27%, sport 18%, truck 12%, bus 10%
  const r = Math.random();
  if (r < 0.33) return 'sedan';
  if (r < 0.60) return 'suv';
  if (r < 0.78) return 'sport';
  if (r < 0.90) return 'truck';
  return 'bus';
}
function randomColor() {
  return TRAFFIC_COLORS[Math.floor(Math.random() * TRAFFIC_COLORS.length)];
}
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

export function GameScene({ isMobile: _isMobile = false }: GameSceneProps) {
  useThree();
  const keys = useInput();

  const {
    mode, isNightMode, selectedColor, selectedBrand, selectedCarModel,
    updateHUD, setGameOver, resetGame, toggleNight, setMode, tickTime,
  } = useGameStore();
  const upgrades = useGameStore(s => s.upgrades);
  const upgradesRef = useRef(upgrades);
  upgradesRef.current = upgrades;

  // Physics refs
  const playerX       = useRef(PLAYER_START_X);
  const playerSpeed   = useRef(0);
  const playerSteering= useRef(0);
  const playerYaw     = useRef(0);
  const distance      = useRef(0);
  const score         = useRef(0);
  const multiplier    = useRef(1);
  const coins         = useRef(0);
  const hudTimer      = useRef(0);
  const camX          = useRef(PLAYER_START_X);
  const camShake      = useRef(0);
  const lastMode      = useRef(mode);
  const nearMissCooldown = useRef(0);
  const nitroLevel    = useRef(1.0);
  const paused        = useRef(false);
  const camSwitchPressed = useRef(false);
  const nightPressed  = useRef(false);
  const bonusCooldown = useRef(0); // throttle showBonusPopup

  // Mesh refs
  const playerCarRef = useRef<Group>(null);
  const roadRefs     = useRef<(Group | null)[]>([]);
  const trafficRefs  = useRef<(Group | null)[]>([]);
  const oncomingRefs = useRef<(Group | null)[]>([]);

  // Data refs
  const trafficData  = useRef<TrafficCar[]>([]);
  const oncomingData = useRef<OncomingCar[]>([]);

  // ── Init / spawn helpers ─────────────────────────────────────────────
  const initTraffic = useCallback(() => {
    // Round-robin lane assignment + evenly spaced Z so cars don't cluster
    trafficData.current = Array.from({ length: MAX_TRAFFIC }, (_, i) => {
      const type = randomTrafficType();
      const lane = i % LANE_COUNT;
      const slot = Math.floor(i / LANE_COUNT);
      return {
        id: i,
        type,
        color: randomColor(),
        lane,
        targetLane: lane,
        x: LANE_POSITIONS[lane],
        z: -(100 + slot * 72 + Math.random() * 36),
        speed: TRAFFIC_MIN_SPEED + Math.random() * (TRAFFIC_MAX_SPEED - TRAFFIC_MIN_SPEED),
        changeCooldown: 5 + i * 0.5 + Math.random() * 7,  // staggered so none change at once
        passed: false,
        ...getCarDims(type),
      };
    });
  }, []);

  const spawnTraffic = useCallback((car: TrafficCar) => {
    const type = randomTrafficType();
    const lane = randomLane();
    car.type          = type;
    car.color         = randomColor();
    car.lane          = lane;
    car.targetLane    = lane;
    car.x             = LANE_POSITIONS[lane];
    // Maintain spacing: spawn behind the frontmost car in this lane by at least 45 units
    const frontZ = trafficData.current
      .filter(c => c.id !== car.id && c.targetLane === lane)
      .reduce((min, c) => Math.min(min, c.z), -200);
    car.z             = Math.min(-(220 + Math.random() * 160), frontZ - 45);
    car.speed         = TRAFFIC_MIN_SPEED + Math.random() * (TRAFFIC_MAX_SPEED - TRAFFIC_MIN_SPEED);
    car.changeCooldown= 4 + Math.random() * 8;
    car.passed        = false;
    const dims = getCarDims(type);
    car.width  = dims.width;
    car.length = dims.length;
  }, []);

  const initOncoming = useCallback(() => {
    oncomingData.current = Array.from({ length: MAX_ONCOMING }, (_, i) => {
      const type = randomTrafficType();
      const lane = randomOncomingLane();
      return {
        id: i + MAX_TRAFFIC,
        type,
        color: randomColor(),
        lane,
        x: ONCOMING_LANES[lane],
        z: -(120 + i * 55 + Math.random() * 80),
        speed: ONCOMING_MIN_SPEED + Math.random() * (ONCOMING_MAX_SPEED - ONCOMING_MIN_SPEED),
        ...getCarDims(type),
      };
    });
  }, []);

  const spawnOncoming = useCallback((car: OncomingCar) => {
    const type = randomTrafficType();
    const lane = randomOncomingLane();
    car.type  = type;
    car.color = randomColor();
    car.lane  = lane;
    car.x     = ONCOMING_LANES[lane];
    car.z     = -(280 + Math.random() * 200);
    car.speed = ONCOMING_MIN_SPEED + Math.random() * (ONCOMING_MAX_SPEED - ONCOMING_MIN_SPEED);
    const dims = getCarDims(type);
    car.width  = dims.width;
    car.length = dims.length;
  }, []);

  // Init on mount
  useEffect(() => {
    initTraffic();
    initOncoming();
  }, [initTraffic, initOncoming]);

  // Reset game + audio lifecycle
  useEffect(() => {
    if (mode === 'playing' && lastMode.current !== 'playing') {
      playerX.current      = PLAYER_START_X;
      playerSpeed.current  = 0;
      playerSteering.current = 0;
      playerYaw.current    = 0;
      distance.current     = 0;
      score.current        = 0;
      multiplier.current   = 1;
      coins.current        = 0;
      camX.current         = PLAYER_START_X;
      resetGame();
      initTraffic();
      initOncoming();
      roadRefs.current.forEach((group, i) => {
        if (group) group.position.z = -(i * SEGMENT_LENGTH);
      });
      initAudio();
    }
    if (mode !== 'playing' && lastMode.current === 'playing') {
      stopEngine();
    }
    lastMode.current = mode;
  }, [mode, resetGame, initTraffic, initOncoming]);

  useFrame(({ camera: cam }, delta) => {
    const dt      = Math.min(delta, 0.05);
    const playing = mode === 'playing';

    // Camera switch — always read fresh from store to avoid stale closure
    if (keys.current.camSwitch && !camSwitchPressed.current) {
      camSwitchPressed.current = true;
      const cur  = useGameStore.getState().cameraMode;
      const next = cur === 'follow' ? 'orbit' : cur === 'orbit' ? 'cockpit' : cur === 'cockpit' ? 'hood' : 'follow';
      useGameStore.getState().setCameraMode(next);
    }
    if (!keys.current.camSwitch) camSwitchPressed.current = false;

    // Night toggle
    if (keys.current.nightToggle && !nightPressed.current) {
      nightPressed.current = true;
      toggleNight();
    }
    if (!keys.current.nightToggle) nightPressed.current = false;

    // Pause
    if (keys.current.pause && !paused.current && playing) {
      paused.current = true;
      setMode('paused');
    }
    if (!keys.current.pause) paused.current = false;

    if (!playing) {
      // Reset FOV so it doesn't stay stretched after a crash
      (cam as PerspectiveCamera).fov = lerp((cam as PerspectiveCamera).fov, 62, Math.min(1, 4 * dt));
      (cam as PerspectiveCamera).updateProjectionMatrix();
      if (mode === 'menu') {
        const t = Date.now() * 0.001;
        cam.position.set(Math.sin(t * 0.2) * 9, 3.5 + Math.sin(t * 0.1) * 0.5, Math.cos(t * 0.2) * 9);
        cam.lookAt(0, 1, 0);
      }
      return;
    }

    // ── PHYSICS ──────────────────────────────────────────────────────────
    const { forward, backward, left, right, handbrake, nitro } = keys.current;

    // Effective values from upgrades
    const { speed: spUpg, nitro: ntUpg, handling: hdUpg } = upgradesRef.current;
    const effectiveMaxSpeed   = MAX_SPEED     * (1 + spUpg * 0.12);
    const effectiveNitroSpeed = NITRO_MAX_SPEED * (1 + ntUpg * 0.15);
    const effectiveTurnRate   = TURN_RATE     * (1 + hdUpg * 0.10);

    // Nitro
    if (nitro && nitroLevel.current > 0) {
      nitroLevel.current = Math.max(0, nitroLevel.current - NITRO_DRAIN * dt);
    } else {
      nitroLevel.current = Math.min(1, nitroLevel.current + NITRO_RECHARGE * dt);
    }
    const nitroActive = nitro && nitroLevel.current > 0;
    const topSpeed    = nitroActive ? effectiveNitroSpeed : effectiveMaxSpeed;

    if (forward) {
      const accel = nitroActive ? ACCELERATION * 2.3 : ACCELERATION;
      playerSpeed.current = Math.min(playerSpeed.current + accel * dt, topSpeed);
    } else if (backward) {
      playerSpeed.current = Math.max(playerSpeed.current - BRAKING * dt, 0);
    } else {
      playerSpeed.current = Math.max(playerSpeed.current - FRICTION * dt, 0);
    }
    if (handbrake) {
      playerSpeed.current *= Math.pow(0.91, dt * 60);
    }

    const speed     = playerSpeed.current;
    const normSpeed = speed / effectiveMaxSpeed;

    // Engine sound
    updateEngine(speed, effectiveMaxSpeed, !!nitroActive);

    // Steering
    const steerDir = (right ? 1 : 0) - (left ? 1 : 0);
    if (steerDir !== 0) {
      playerSteering.current = MathUtils.clamp(
        playerSteering.current + steerDir * STEERING_SPEED * dt,
        -MAX_STEERING,
        MAX_STEERING,
      );
    } else {
      playerSteering.current = lerp(playerSteering.current, 0, Math.min(1, 8 * dt));
    }

    const steerFactor = Math.max(normSpeed, 0.18);
    const turnAmount  = playerSteering.current * steerFactor * effectiveTurnRate * dt;
    playerX.current   = MathUtils.clamp(playerX.current + turnAmount, PLAYER_MIN_X, PLAYER_MAX_X);

    // Visual yaw + banking (Traffic Racer lean)
    playerYaw.current = lerp(playerYaw.current, -playerSteering.current * normSpeed * 0.22, Math.min(1, 6 * dt));

    if (playerCarRef.current) {
      playerCarRef.current.position.x = playerX.current;
      playerCarRef.current.rotation.y = playerYaw.current;
      // Lean into turns — like Traffic Racer
      playerCarRef.current.rotation.z = lerp(
        playerCarRef.current.rotation.z,
        -playerSteering.current * normSpeed * 0.09,
        Math.min(1, 7 * dt),
      );
    }

    // ── WORLD SCROLL ──────────────────────────────────────────────────
    const worldDelta = speed * dt;
    roadRefs.current.forEach(group => {
      if (!group) return;
      group.position.z += worldDelta;
      if (group.position.z > SEGMENT_LENGTH * 0.6) {
        group.position.z -= SEGMENT_COUNT * SEGMENT_LENGTH;
      }
    });

    // ── SAME-DIRECTION TRAFFIC ─────────────────────────────────────────
    trafficData.current.forEach((car, i) => {
      car.z += (car.speed - speed) * dt;

      // Avoid car ahead — look forward by car-length + buffer
      const lookAhead = car.length + 12;
      trafficData.current.forEach(other => {
        if (other.id === car.id) return;
        const dz = other.z - car.z;          // negative = other is ahead (more negative Z)
        const dx = Math.abs(other.x - car.x);
        if (dz > -lookAhead && dz < 2 && dx < 2.5) {
          car.speed = Math.max(car.speed - 20 * dt, TRAFFIC_MIN_SPEED * 0.6);
          if (car.changeCooldown > 1.5) car.changeCooldown = 0.5; // trigger early lane change
        }
      });

      // Lane change AI — only switch to a lane that is actually clear
      car.changeCooldown -= dt;
      if (car.changeCooldown <= 0) {
        const candidates = Array.from({ length: LANE_COUNT }, (_, l) => l)
          .filter(l => l !== car.targetLane)
          .sort(() => Math.random() - 0.5);    // randomise order
        const freeLane = candidates.find(tl => {
          const tx = LANE_POSITIONS[tl];
          return !trafficData.current.some(
            o => o.id !== car.id && Math.abs(o.x - tx) < 2.0 && Math.abs(o.z - car.z) < 22
          );
        });
        if (freeLane !== undefined) car.targetLane = freeLane;
        car.changeCooldown = 4 + Math.random() * 8;
      }

      car.x = lerp(car.x, LANE_POSITIONS[car.targetLane], Math.min(1, 1.5 * dt));

      if (car.z > 80 || car.z < -700) spawnTraffic(car);

      // Overtake detection: car just drifted past the player
      if (!car.passed && car.z > car.length / 2 + 1) {
        car.passed = true;
        score.current += OVERTAKE_BONUS;
        coins.current += 1;
        playCoin();
        if (bonusCooldown.current <= 0) {
          useGameStore.getState().showBonusPopup(`+${OVERTAKE_BONUS} GEÇİŞ!`);
          bonusCooldown.current = 0.6;
        }
      }
      if (car.z < 0) car.passed = false;

      const ref = trafficRefs.current[i];
      if (ref) {
        ref.position.x = car.x;
        ref.position.z = car.z;
        ref.position.y = 0;
      }
    });

    // ── ONCOMING TRAFFIC ──────────────────────────────────────────────
    oncomingData.current.forEach((car, i) => {
      // Oncoming cars rush toward player (relative velocity = own speed + player speed)
      car.z += (car.speed + speed) * dt;

      if (car.z > 70) spawnOncoming(car);

      const ref = oncomingRefs.current[i];
      if (ref) {
        ref.position.x = car.x;
        ref.position.z = car.z;
        ref.position.y = 0;
      }
    });

    // ── COLLISION + NEAR MISS ─────────────────────────────────────────
    nearMissCooldown.current  = Math.max(0, nearMissCooldown.current - dt);
    bonusCooldown.current     = Math.max(0, bonusCooldown.current - dt);

    // Same-direction cars
    for (const car of trafficData.current) {
      const dx = Math.abs(playerX.current - car.x);
      const dz = Math.abs(car.z);
      if (dx < COLLISION_X + car.width / 2 && dz < COLLISION_Z + car.length / 2) {
        playCrash();
        setGameOver(Math.floor(score.current));
        return;
      }
      if (
        nearMissCooldown.current <= 0 &&
        dx < NEAR_MISS_X + car.width / 2 &&
        dz < NEAR_MISS_Z + car.length / 2 &&
        dz > COLLISION_Z + car.length / 2
      ) {
        score.current    += NEAR_MISS_BONUS * multiplier.current;
        coins.current    += 2;
        multiplier.current = Math.min(multiplier.current + 0.5, 8);
        camShake.current   = 0.14;
        nearMissCooldown.current = 0.5;
        playWhoosh();
        useGameStore.getState().showBonusPopup(`YAKLAŞMA! +${NEAR_MISS_BONUS}`);
      }
    }

    // Oncoming cars — higher speed means higher danger & reward
    for (const car of oncomingData.current) {
      const dx = Math.abs(playerX.current - car.x);
      const dz = Math.abs(car.z);
      if (dx < COLLISION_X + car.width / 2 && dz < COLLISION_Z + car.length / 2) {
        playCrash();
        setGameOver(Math.floor(score.current));
        return;
      }
      if (
        nearMissCooldown.current <= 0 &&
        dx < NEAR_MISS_X + car.width / 2 + 0.4 &&
        dz < NEAR_MISS_Z + car.length / 2 &&
        dz > COLLISION_Z + car.length / 2
      ) {
        score.current    += ONCOMING_NEAR_MISS_BONUS * multiplier.current;
        coins.current    += 5;
        multiplier.current = Math.min(multiplier.current + 1.0, 10);
        camShake.current   = 0.28;
        nearMissCooldown.current = 0.45;
        playWhoosh();
        useGameStore.getState().showBonusPopup(`TEHLİKELİ! +${ONCOMING_NEAR_MISS_BONUS}`);
      }
    }

    // ── SCORING ───────────────────────────────────────────────────────
    distance.current += worldDelta;
    score.current    += speed * dt * 0.4 * multiplier.current;

    if (speed < MAX_SPEED * 0.3) {
      multiplier.current = Math.max(1, multiplier.current - 0.5 * dt);
    }

    tickTime(dt);

    // ── CAMERA ────────────────────────────────────────────────────────
    camShake.current = Math.max(0, camShake.current - dt * 3.5);
    const shake      = camShake.current * (Math.random() - 0.5);

    camX.current = lerp(camX.current, playerX.current, Math.min(1, 5 * dt));

    const perCam = useGameStore.getState().cameraMode;

    if (perCam === 'orbit') {
      // Cinematic 360° — slowly orbits the player car
      (cam as PerspectiveCamera).fov = lerp((cam as PerspectiveCamera).fov, 52, Math.min(1, 3 * dt));
      (cam as PerspectiveCamera).updateProjectionMatrix();
      const t  = Date.now() * 0.00038;
      const r  = 9.5;
      const vy = 2.6 + Math.sin(t * 0.42) * 0.8;
      cam.position.set(
        playerX.current + Math.sin(t) * r + shake * 0.4,
        vy + shake * 0.25,
        Math.cos(t) * r * 0.52 + shake * 0.2,
      );
      cam.lookAt(playerX.current, 1.1 + shake * 0.12, 0);
    } else {
      const fovTarget = 62 + normSpeed * 28;
      (cam as PerspectiveCamera).fov = lerp((cam as PerspectiveCamera).fov, fovTarget, Math.min(1, 3 * dt));
      (cam as PerspectiveCamera).updateProjectionMatrix();
      if (perCam === 'follow') {
        const camY = 3.2 + speed * 0.012;
        const camZ = 7.8 - speed * 0.025;
        cam.position.set(camX.current + shake, camY + shake * 0.5, camZ);
        cam.lookAt(playerX.current, 1.1 + shake * 0.3, -14 - normSpeed * 6);
      } else if (perCam === 'cockpit') {
        cam.position.set(playerX.current + shake * 0.1, 1.3 + shake * 0.05, 0.2);
        cam.lookAt(playerX.current + playerYaw.current * 2 + shake * 0.3, 1.2 + shake * 0.1, -80);
      } else {
        // hood
        cam.position.set(playerX.current + shake * 0.1, 1.8 + shake * 0.05, 1.8);
        cam.lookAt(playerX.current + playerYaw.current * 1.5 + shake * 0.2, 1.0, -50);
      }
    }

    // ── HUD UPDATE ────────────────────────────────────────────────────
    hudTimer.current += dt;
    if (hudTimer.current >= 0.05) {
      hudTimer.current = 0;
      updateHUD(
        Math.round(speed * SPEED_TO_KMH),
        Math.floor(score.current),
        Math.floor(distance.current / 10),
        Math.round(multiplier.current * 10) / 10,
        coins.current,
        nitroLevel.current,
      );
    }
  });

  const carColor = selectedColor === 'sport'  ? '#e11d48'
    : selectedColor === 'blue'   ? '#2563eb'
    : selectedColor === 'black'  ? '#111'
    : selectedColor === 'white'  ? '#f9fafb'
    : selectedColor === 'yellow' ? '#eab308'
    : '#94a3b8';

  return (
    <>
      <Environment isNight={isNightMode} />
      <IBL preset={isNightMode ? 'night' : 'sunset'} background={false} />

      {/* Road segments */}
      {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
        <group
          key={i}
          ref={el => { roadRefs.current[i] = el; }}
          position={[0, 0, -(i * SEGMENT_LENGTH)]}
        >
          <RoadSegmentMesh isNight={isNightMode} />
        </group>
      ))}

      {/* Player car */}
      <PlayerCarMesh
        ref={playerCarRef}
        color={carColor}
        isNight={isNightMode}
        brand={selectedBrand}
        model={selectedCarModel}
      />

      {/* Player headlight beams (night) */}
      {isNightMode && (
        <>
          <spotLight
            position={[playerX.current + 0.65, 0.55, -2.3]}
            target-position={[playerX.current + 0.65, 0, -30]}
            angle={0.34}
            penumbra={0.4}
            intensity={45}
            distance={52}
            color="white"
          />
          <spotLight
            position={[playerX.current - 0.65, 0.55, -2.3]}
            target-position={[playerX.current - 0.65, 0, -30]}
            angle={0.34}
            penumbra={0.4}
            intensity={45}
            distance={52}
            color="white"
          />
        </>
      )}

      {/* Same-direction traffic — rotated 180° so taillights face player */}
      {trafficData.current.map((car, i) => (
        <group
          key={car.id}
          ref={el => { trafficRefs.current[i] = el; }}
          position={[car.x, 0, car.z]}
        >
          <group rotation={[0, Math.PI, 0]}>
            <TrafficCarMesh type={car.type} color={car.color} isNight={isNightMode} />
          </group>
        </group>
      ))}

      {/* Oncoming traffic — no rotation, headlights face player */}
      {oncomingData.current.map((car, i) => (
        <group
          key={car.id}
          ref={el => { oncomingRefs.current[i] = el; }}
          position={[car.x, 0, car.z]}
        >
          <TrafficCarMesh type={car.type} color={car.color} isNight={isNightMode} />
        </group>
      ))}
    </>
  );
}

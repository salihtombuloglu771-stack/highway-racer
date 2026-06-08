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
import {
  MAX_SPEED, ACCELERATION, BRAKING, FRICTION, MAX_STEERING, STEERING_SPEED, TURN_RATE,
  SEGMENT_LENGTH, SEGMENT_COUNT, SPEED_TO_KMH, LANE_POSITIONS, LANE_COUNT,
  MAX_TRAFFIC, TRAFFIC_MIN_SPEED, TRAFFIC_MAX_SPEED, TRAFFIC_TYPES, TRAFFIC_COLORS,
  NEAR_MISS_X, NEAR_MISS_Z, COLLISION_X, COLLISION_Z, TrafficType,
} from '@/utils/constants';

interface GameSceneProps {
  isMobile?: boolean;
}

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
}

function getCarDims(type: TrafficType): { width: number; length: number } {
  switch (type) {
    case 'truck': return { width: 2.3, length: 12 };
    case 'bus': return { width: 2.3, length: 8.5 };
    case 'suv': return { width: 2.1, length: 4.5 };
    case 'sport': return { width: 2.3, length: 4.6 };
    default: return { width: 2.0, length: 4.2 };
  }
}

function randomLane() { return Math.floor(Math.random() * LANE_COUNT); }
function randomTrafficType(): TrafficType { return TRAFFIC_TYPES[Math.floor(Math.random() * TRAFFIC_TYPES.length)]; }
function randomColor() { return TRAFFIC_COLORS[Math.floor(Math.random() * TRAFFIC_COLORS.length)]; }

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

export function GameScene({ isMobile = false }: GameSceneProps) {
  useThree(); // access camera via useFrame below
  const keys = useInput();

  const { mode, cameraMode, isNightMode, selectedColor, updateHUD, setGameOver, resetGame, toggleNight, setMode, tickTime } = useGameStore();

  // Physics refs (avoid React re-renders)
  const playerX = useRef(0);
  const playerSpeed = useRef(0);
  const playerSteering = useRef(0);
  const playerYaw = useRef(0);
  const distance = useRef(0);
  const score = useRef(0);
  const multiplier = useRef(1);
  const coins = useRef(0);
  const hudTimer = useRef(0);
  const camX = useRef(0);
  const camShake = useRef(0);
  const lastMode = useRef(mode);
  const nearMissCooldown = useRef(0);
  const paused = useRef(false);
  const camSwitchPressed = useRef(false);
  const nightPressed = useRef(false);

  // Mesh refs
  const playerCarRef = useRef<Group>(null);
  const roadRefs = useRef<(Group | null)[]>([]);
  const trafficRefs = useRef<(Group | null)[]>([]);

  // Traffic data
  const trafficData = useRef<TrafficCar[]>([]);

  const initTraffic = useCallback(() => {
    trafficData.current = Array.from({ length: MAX_TRAFFIC }, (_, i) => {
      const type = randomTrafficType();
      const lane = randomLane();
      return {
        id: i,
        type,
        color: randomColor(),
        lane,
        targetLane: lane,
        x: LANE_POSITIONS[lane],
        z: -(80 + Math.random() * 400),
        speed: TRAFFIC_MIN_SPEED + Math.random() * (TRAFFIC_MAX_SPEED - TRAFFIC_MIN_SPEED),
        changeCooldown: Math.random() * 5,
        ...getCarDims(type),
      };
    });
  }, []);

  const spawnTraffic = useCallback((car: TrafficCar) => {
    const type = randomTrafficType();
    const lane = randomLane();
    car.type = type;
    car.color = randomColor();
    car.lane = lane;
    car.targetLane = lane;
    car.x = LANE_POSITIONS[lane];
    car.z = -(200 + Math.random() * 200);
    car.speed = TRAFFIC_MIN_SPEED + Math.random() * (TRAFFIC_MAX_SPEED - TRAFFIC_MIN_SPEED);
    car.changeCooldown = 2 + Math.random() * 5;
    const dims = getCarDims(type);
    car.width = dims.width;
    car.length = dims.length;
  }, []);

  // Init on mount
  useEffect(() => {
    initTraffic();
  }, [initTraffic]);

  // Reset game
  useEffect(() => {
    if (mode === 'playing' && lastMode.current !== 'playing') {
      playerX.current = 0;
      playerSpeed.current = 0;
      playerSteering.current = 0;
      playerYaw.current = 0;
      distance.current = 0;
      score.current = 0;
      multiplier.current = 1;
      coins.current = 0;
      camX.current = 0;
      resetGame();
      initTraffic();
      // Reset road positions
      roadRefs.current.forEach((group, i) => {
        if (group) group.position.z = -(i * SEGMENT_LENGTH);
      });
    }
    lastMode.current = mode;
  }, [mode, resetGame, initTraffic]);

  useFrame(({ camera: cam }, delta) => {
    const dt = Math.min(delta, 0.05);
    const playing = mode === 'playing';

    // Camera switch
    if (keys.current.camSwitch && !camSwitchPressed.current) {
      camSwitchPressed.current = true;
      const next = cameraMode === 'follow' ? 'cockpit' : cameraMode === 'cockpit' ? 'hood' : 'follow';
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
      // Idle spin camera for menu
      if (mode === 'menu') {
        const t = Date.now() * 0.001;
        cam.position.set(Math.sin(t * 0.2) * 8, 3.5 + Math.sin(t * 0.1) * 0.5, Math.cos(t * 0.2) * 8);
        cam.lookAt(0, 1, 0);
      }
      return;
    }

    // ── PHYSICS ──────────────────────────────────────────────────────
    const { forward, backward, left, right, handbrake } = keys.current;

    // Speed
    if (forward) {
      playerSpeed.current = Math.min(playerSpeed.current + ACCELERATION * dt, MAX_SPEED);
    } else if (backward) {
      playerSpeed.current = Math.max(playerSpeed.current - BRAKING * dt, 0);
    } else {
      playerSpeed.current = Math.max(playerSpeed.current - FRICTION * dt, 0);
    }
    if (handbrake) {
      playerSpeed.current *= Math.pow(0.92, dt * 60);
    }

    const speed = playerSpeed.current;
    const normSpeed = speed / MAX_SPEED;

    // Steering
    const steerDir = (left ? 1 : 0) - (right ? 1 : 0);
    if (steerDir !== 0) {
      playerSteering.current = MathUtils.clamp(
        playerSteering.current + steerDir * STEERING_SPEED * dt,
        -MAX_STEERING,
        MAX_STEERING
      );
    } else {
      playerSteering.current = lerp(playerSteering.current, 0, Math.min(1, 8 * dt));
    }

    // Apply lateral movement
    const turnAmount = playerSteering.current * normSpeed * TURN_RATE * dt;
    playerX.current = MathUtils.clamp(playerX.current + turnAmount, -6.5, 6.5);

    // Visual yaw
    playerYaw.current = lerp(playerYaw.current, -playerSteering.current * normSpeed * 0.22, Math.min(1, 6 * dt));

    // Apply to mesh
    if (playerCarRef.current) {
      playerCarRef.current.position.x = playerX.current;
      playerCarRef.current.rotation.y = playerYaw.current;
    }

    // ── WORLD SCROLL ─────────────────────────────────────────────────
    const worldDelta = speed * dt;

    // Road segments (treadmill)
    roadRefs.current.forEach(group => {
      if (!group) return;
      group.position.z += worldDelta;
      if (group.position.z > SEGMENT_LENGTH * 0.6) {
        group.position.z -= SEGMENT_COUNT * SEGMENT_LENGTH;
      }
    });

    // ── TRAFFIC ──────────────────────────────────────────────────────
    trafficData.current.forEach((car, i) => {
      // Move relative to player
      car.z += (car.speed - speed) * dt;

      // Lane change AI
      car.changeCooldown -= dt;
      if (car.changeCooldown <= 0) {
        const possibleLanes = Array.from({ length: LANE_COUNT }, (_, l) => l).filter(l => l !== car.targetLane);
        car.targetLane = possibleLanes[Math.floor(Math.random() * possibleLanes.length)];
        car.changeCooldown = 3 + Math.random() * 6;
      }

      // Avoid car ahead (simple)
      trafficData.current.forEach(other => {
        if (other.id === car.id) return;
        const dz = other.z - car.z;
        const dx = Math.abs(other.x - car.x);
        if (dz > -12 && dz < 0 && dx < 2) {
          // Slow down
          car.speed = Math.max(car.speed - 15 * dt, TRAFFIC_MIN_SPEED * 0.5);
          // Try to change lane
          if (car.changeCooldown > 1) car.changeCooldown = 0.5;
        }
      });

      // Smooth lane change
      car.x = lerp(car.x, LANE_POSITIONS[car.targetLane], Math.min(1, 1.5 * dt));

      // Respawn if behind player
      if (car.z > 80) {
        spawnTraffic(car);
      }

      // Update mesh
      const ref = trafficRefs.current[i];
      if (ref) {
        ref.position.x = car.x;
        ref.position.z = car.z;
        ref.position.y = 0;
      }
    });

    // ── COLLISION ────────────────────────────────────────────────────
    nearMissCooldown.current = Math.max(0, nearMissCooldown.current - dt);

    for (const car of trafficData.current) {
      const dx = Math.abs(playerX.current - car.x);
      const dz = Math.abs(car.z);

      if (dx < COLLISION_X + car.width / 2 && dz < COLLISION_Z + car.length / 2) {
        // CRASH
        setGameOver(Math.floor(score.current));
        return;
      }

      if (nearMissCooldown.current <= 0 && dx < NEAR_MISS_X + car.width / 2 && dz < NEAR_MISS_Z && dz > COLLISION_Z + car.length / 2) {
        // Near miss bonus
        score.current += 100 * multiplier.current;
        multiplier.current = Math.min(multiplier.current + 0.5, 8);
        camShake.current = 0.15;
        nearMissCooldown.current = 0.5;
      }
    }

    // ── SCORING ──────────────────────────────────────────────────────
    distance.current += worldDelta;
    score.current += speed * dt * 0.4 * multiplier.current;

    // Multiplier decay when slow
    if (speed < MAX_SPEED * 0.3) {
      multiplier.current = Math.max(1, multiplier.current - 0.5 * dt);
    }

    // Time trial
    tickTime(dt);

    // ── CAMERA ───────────────────────────────────────────────────────
    camShake.current = Math.max(0, camShake.current - dt * 3);
    const shake = camShake.current * (Math.random() - 0.5);

    camX.current = lerp(camX.current, playerX.current, Math.min(1, 5 * dt));

    const perCam = useGameStore.getState().cameraMode;
    const fovTarget = 65 + normSpeed * 25;
    (cam as PerspectiveCamera).fov = lerp((cam as PerspectiveCamera).fov, fovTarget, Math.min(1, 3 * dt));
    (cam as PerspectiveCamera).updateProjectionMatrix();

    if (perCam === 'follow') {
      const camY = 3.5 + speed * 0.015;
      const camZ = 7.5 - speed * 0.03;
      cam.position.set(camX.current + shake, camY + shake * 0.5, camZ);
      cam.lookAt(playerX.current, 1.2 + shake * 0.3, -12 - normSpeed * 5);
    } else if (perCam === 'cockpit') {
      cam.position.set(playerX.current + shake * 0.1, 1.3 + shake * 0.05, 0.2);
      cam.lookAt(playerX.current + playerYaw.current * 2 + shake * 0.3, 1.2 + shake * 0.1, -80);
    } else {
      // Hood cam
      cam.position.set(playerX.current + shake * 0.1, 1.8 + shake * 0.05, 1.8);
      cam.lookAt(playerX.current + playerYaw.current * 1.5 + shake * 0.2, 1.0, -50);
    }

    // ── HUD UPDATE ───────────────────────────────────────────────────
    hudTimer.current += dt;
    if (hudTimer.current >= 0.05) {
      hudTimer.current = 0;
      updateHUD(
        Math.round(speed * SPEED_TO_KMH),
        Math.floor(score.current),
        Math.floor(distance.current / 10),
        Math.round(multiplier.current * 10) / 10,
        coins.current,
      );
    }
  });

  const carColor = selectedColor === 'sport' ? '#e11d48'
    : selectedColor === 'blue' ? '#2563eb'
    : selectedColor === 'black' ? '#111'
    : selectedColor === 'white' ? '#f9fafb'
    : selectedColor === 'yellow' ? '#eab308'
    : '#94a3b8';

  return (
    <>
      <Environment isNight={isNightMode} />

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
      <PlayerCarMesh ref={playerCarRef} color={carColor} isNight={isNightMode} />

      {/* Player headlight beams */}
      {isNightMode && (
        <>
          <spotLight
            position={[playerX.current + 0.65, 0.55, -2.3]}
            target-position={[playerX.current + 0.65, 0, -30]}
            angle={0.35}
            penumbra={0.4}
            intensity={40}
            distance={50}
            color="white"
          />
          <spotLight
            position={[playerX.current - 0.65, 0.55, -2.3]}
            target-position={[playerX.current - 0.65, 0, -30]}
            angle={0.35}
            penumbra={0.4}
            intensity={40}
            distance={50}
            color="white"
          />
        </>
      )}

      {/* Traffic cars */}
      {trafficData.current.map((car, i) => (
        <group
          key={car.id}
          ref={el => { trafficRefs.current[i] = el; }}
          position={[car.x, 0, car.z]}
        >
          <TrafficCarMesh type={car.type} color={car.color} isNight={isNightMode} />
        </group>
      ))}
    </>
  );
}

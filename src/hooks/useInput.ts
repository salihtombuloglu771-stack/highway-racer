'use client';
import { useEffect, useRef } from 'react';

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  handbrake: boolean;
  nitro: boolean;
  camSwitch: boolean;
  pause: boolean;
  nightToggle: boolean;
}

const GAME_KEYS = new Set([
  'ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
  'KeyW','KeyS','KeyA','KeyD','Space',
  'KeyC','KeyN','Escape','KeyP','ShiftLeft','ShiftRight',
]);

export function useInput() {
  const keys = useRef<InputState>({
    forward: false, backward: false, left: false, right: false,
    handbrake: false, nitro: false, camSwitch: false, pause: false, nightToggle: false,
  });

  useEffect(() => {
    // Ensure keyboard events always reach the game
    if (typeof document !== 'undefined') {
      document.body.tabIndex = -1;
    }

    const onDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (GAME_KEYS.has(e.code)) e.preventDefault();
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keys.current.forward   = true; break;
        case 'KeyS': case 'ArrowDown':  keys.current.backward  = true; break;
        case 'KeyA': case 'ArrowLeft':  keys.current.left      = true; break;
        case 'KeyD': case 'ArrowRight': keys.current.right     = true; break;
        case 'Space':                   keys.current.handbrake = true; break;
        case 'ShiftLeft': case 'ShiftRight': keys.current.nitro = true; break;
        case 'KeyC':   keys.current.camSwitch  = true; break;
        case 'Escape': case 'KeyP': keys.current.pause = true; break;
        case 'KeyN':   keys.current.nightToggle = true; break;
      }
    };
    const onUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keys.current.forward   = false; break;
        case 'KeyS': case 'ArrowDown':  keys.current.backward  = false; break;
        case 'KeyA': case 'ArrowLeft':  keys.current.left      = false; break;
        case 'KeyD': case 'ArrowRight': keys.current.right     = false; break;
        case 'Space':                   keys.current.handbrake = false; break;
        case 'ShiftLeft': case 'ShiftRight': keys.current.nitro = false; break;
        case 'KeyC':   keys.current.camSwitch  = false; break;
        case 'Escape': case 'KeyP': keys.current.pause = false; break;
        case 'KeyN':   keys.current.nightToggle = false; break;
      }
    };
    // capture:true ensures we get events before any element stops propagation
    window.addEventListener('keydown', onDown, { capture: true });
    window.addEventListener('keyup',   onUp,   { capture: true });
    return () => {
      window.removeEventListener('keydown', onDown, { capture: true });
      window.removeEventListener('keyup',   onUp,   { capture: true });
    };
  }, []);

  return keys;
}

export function useMobileInput() {
  const mobile = useRef({ steer: 0, gas: 0, brake: 0 });
  return mobile;
}

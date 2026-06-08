'use client';
import { useEffect, useRef } from 'react';

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  handbrake: boolean;
  camSwitch: boolean;
  pause: boolean;
  nightToggle: boolean;
}

export function useInput() {
  const keys = useRef<InputState>({
    forward: false, backward: false, left: false, right: false,
    handbrake: false, camSwitch: false, pause: false, nightToggle: false,
  });

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keys.current.forward = true; e.preventDefault(); break;
        case 'KeyS': case 'ArrowDown': keys.current.backward = true; e.preventDefault(); break;
        case 'KeyA': case 'ArrowLeft': keys.current.left = true; e.preventDefault(); break;
        case 'KeyD': case 'ArrowRight': keys.current.right = true; e.preventDefault(); break;
        case 'Space': keys.current.handbrake = true; e.preventDefault(); break;
        case 'KeyC': keys.current.camSwitch = true; break;
        case 'Escape': case 'KeyP': keys.current.pause = true; break;
        case 'KeyN': keys.current.nightToggle = true; break;
      }
    };
    const onUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keys.current.forward = false; break;
        case 'KeyS': case 'ArrowDown': keys.current.backward = false; break;
        case 'KeyA': case 'ArrowLeft': keys.current.left = false; break;
        case 'KeyD': case 'ArrowRight': keys.current.right = false; break;
        case 'Space': keys.current.handbrake = false; break;
        case 'KeyC': keys.current.camSwitch = false; break;
        case 'Escape': case 'KeyP': keys.current.pause = false; break;
        case 'KeyN': keys.current.nightToggle = false; break;
      }
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
  }, []);

  return keys;
}

export function useMobileInput() {
  const mobile = useRef({ steer: 0, gas: 0, brake: 0 });
  return mobile;
}

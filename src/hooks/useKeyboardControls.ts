import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

interface KeyMap {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
}

const initialKeys: KeyMap = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  sprint: false,
};

const KEY_BINDINGS: Record<string, keyof KeyMap> = {
  KeyW: 'forward',
  KeyS: 'backward',
  KeyA: 'left',
  KeyD: 'right',
  ShiftLeft: 'sprint',
  ShiftRight: 'sprint',
};

export function useKeyboardControls() {
  const keys = useRef<KeyMap>({ ...initialKeys });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Toggle Camera Mode with 'C'
    if (e.code === 'KeyC' && !e.repeat) {
      e.preventDefault();
      useGameStore.getState().toggleCameraMode();
      return;
    }

    // 'E' membuka/menutup lightbox karya yang sedang dekat; Esc menutup
    if (e.code === 'KeyE' && !e.repeat) {
      const state = useGameStore.getState();
      if (state.lightboxOpen) {
        state.closeLightbox();
      } else if (state.activeExhibitId != null) {
        state.toggleLightbox();
      }
      return;
    }
    if (e.code === 'Escape' && !e.repeat) {
      useGameStore.getState().closeLightbox();
      return;
    }

    const action = KEY_BINDINGS[e.code];
    if (action) {
      e.preventDefault();
      keys.current[action] = true;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const action = KEY_BINDINGS[e.code];
    if (action) {
      e.preventDefault();
      keys.current[action] = false;
    }
  }, []);

  const handleBlur = useCallback(() => {
    // Reset all keys when window loses focus
    Object.assign(keys.current, initialKeys);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleKeyDown, handleKeyUp, handleBlur]);

  return keys;
}

import { useEffect, useRef } from 'react';

export interface KeyboardState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
}

/**
 * Returns a stable ref whose `.current` always reflects the live keyboard state.
 * Using a ref (instead of useState) means useFrame callbacks always read the
 * latest value without stale-closure issues.
 */
export function useKeyboardControls(): React.RefObject<KeyboardState> {
  const stateRef = useRef<KeyboardState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  const keysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const updateState = () => {
      const keys = keysRef.current;
      stateRef.current = {
        forward: keys.has('KeyW') || keys.has('ArrowUp'),
        backward: keys.has('KeyS') || keys.has('ArrowDown'),
        left: keys.has('KeyA') || keys.has('ArrowLeft'),
        right: keys.has('KeyD') || keys.has('ArrowRight'),
        jump: keys.has('Space'),
      };
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent page scroll on arrow keys / space
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      keysRef.current.add(e.code);
      updateState();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
      updateState();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return stateRef;
}

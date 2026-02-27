import { useEffect, useRef, useState } from 'react';

export interface KeyboardState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
}

export function useKeyboardControls(): KeyboardState {
  const keysRef = useRef<Set<string>>(new Set());
  const [state, setState] = useState<KeyboardState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  useEffect(() => {
    const updateState = () => {
      const keys = keysRef.current;
      setState({
        forward: keys.has('KeyW') || keys.has('ArrowUp'),
        backward: keys.has('KeyS') || keys.has('ArrowDown'),
        left: keys.has('KeyA') || keys.has('ArrowLeft'),
        right: keys.has('KeyD') || keys.has('ArrowRight'),
        jump: keys.has('Space'),
      });
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

  return state;
}

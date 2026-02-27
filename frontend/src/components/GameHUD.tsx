import { Volume2, VolumeX } from 'lucide-react';
import * as THREE from 'three';

interface GameHUDProps {
  birdPosition: THREE.Vector3;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function GameHUD({ birdPosition, isMuted, onToggleMute }: GameHUDProps) {
  const x = birdPosition.x.toFixed(1);
  const y = birdPosition.y.toFixed(1);
  const z = birdPosition.z.toFixed(1);

  return (
    <div className="absolute inset-0 pointer-events-none select-none font-pixel">
      {/* Title bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pt-3">
        <div className="hud-panel px-4 py-2">
          <span className="text-mc-yellow" style={{ fontSize: '9px' }}>
            🐦 BLUE BIRD VILLAGE
          </span>
        </div>
      </div>

      {/* Position HUD - top left */}
      <div className="absolute top-3 left-3">
        <div className="hud-panel p-3 space-y-1.5">
          <div className="text-mc-green" style={{ fontSize: '7px' }}>
            POSITION
          </div>
          <div className="text-white" style={{ fontSize: '7px' }}>
            X: <span className="text-mc-yellow">{x}</span>
          </div>
          <div className="text-white" style={{ fontSize: '7px' }}>
            Y: <span className="text-mc-yellow">{y}</span>
          </div>
          <div className="text-white" style={{ fontSize: '7px' }}>
            Z: <span className="text-mc-yellow">{z}</span>
          </div>
        </div>
      </div>

      {/* Mute button - top right */}
      <div className="absolute top-3 right-3 pointer-events-auto">
        <button
          onClick={onToggleMute}
          className="hud-button flex items-center gap-2 px-3 py-2"
          title={isMuted ? 'Unmute music' : 'Mute music'}
        >
          {isMuted ? (
            <VolumeX size={12} className="text-mc-red" />
          ) : (
            <Volume2 size={12} className="text-mc-green" />
          )}
          <span className="text-white" style={{ fontSize: '7px' }}>
            {isMuted ? 'MUTED' : 'MUSIC ON'}
          </span>
        </button>
      </div>

      {/* Controls hint - bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div className="hud-panel px-4 py-2 flex gap-5">
          <span className="text-mc-green" style={{ fontSize: '7px' }}>
            WASD / ↑↓←→ MOVE
          </span>
          <span className="text-mc-yellow" style={{ fontSize: '7px' }}>
            SPACE JUMP
          </span>
        </div>
      </div>

      {/* Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-5 h-5">
          <div
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 bg-white opacity-70"
            style={{ height: '2px' }}
          />
          <div
            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 bg-white opacity-70"
            style={{ width: '2px' }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-center">
        <span className="text-white opacity-30" style={{ fontSize: '6px' }}>
          Built with ♥ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname || 'blue-bird-village' : 'blue-bird-village'
            )}`}
            className="underline pointer-events-auto"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </span>
      </div>
    </div>
  );
}

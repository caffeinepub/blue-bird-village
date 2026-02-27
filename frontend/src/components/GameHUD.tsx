import { Volume2, VolumeX } from 'lucide-react';
import * as THREE from 'three';

interface GameHUDProps {
  birdPosition: THREE.Vector3;
  isMuted: boolean;
  onToggleMute: () => void;
  showHints?: boolean;
}

export default function GameHUD({ birdPosition, isMuted, onToggleMute, showHints = true }: GameHUDProps) {
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
          className="hud-button flex items-center gap-2 px-4 py-3"
          title={isMuted ? 'Unmute music' : 'Mute music'}
          style={{
            background: isMuted
              ? 'rgba(80, 20, 20, 0.92)'
              : 'rgba(20, 60, 20, 0.92)',
            minWidth: 110,
          }}
        >
          {isMuted ? (
            <VolumeX size={14} className="text-mc-red" />
          ) : (
            <Volume2 size={14} className="text-mc-green" />
          )}
          <span
            style={{
              fontSize: '7px',
              color: isMuted ? 'oklch(0.80 0.22 25)' : 'oklch(0.85 0.22 145)',
              letterSpacing: '0.05em',
            }}
          >
            {isMuted ? 'MUTED' : 'MUSIC ON'}
          </span>
        </button>
      </div>

      {/* Controls Panel - bottom left, prominent — toggled by pink button */}
      {showHints && (
        <div className="absolute left-3" style={{ bottom: 100 }}>
          <div className="hud-panel p-3 space-y-2">
            <div className="text-mc-yellow" style={{ fontSize: '8px', letterSpacing: '0.05em' }}>
              CONTROLS
            </div>
            <div className="space-y-2">
              {/* Move row */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {['W', 'A', 'S', 'D'].map((k) => (
                    <kbd
                      key={k}
                      className="inline-flex items-center justify-center bg-mc-dirt border-b-2 border-mc-grass text-white"
                      style={{ fontSize: '7px', minWidth: '20px', height: '18px', padding: '0 3px' }}
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
                <span className="text-mc-green" style={{ fontSize: '7px' }}>
                  MOVE
                </span>
              </div>

              {/* Arrow keys row */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {['↑', '←', '↓', '→'].map((k) => (
                    <kbd
                      key={k}
                      className="inline-flex items-center justify-center bg-mc-dirt border-b-2 border-mc-grass text-white"
                      style={{ fontSize: '7px', minWidth: '20px', height: '18px', padding: '0 3px' }}
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
                <span className="text-mc-green" style={{ fontSize: '7px' }}>
                  MOVE
                </span>
              </div>

              {/* Jump row */}
              <div className="flex items-center gap-2">
                <kbd
                  className="inline-flex items-center justify-center bg-mc-dirt border-b-2 border-mc-grass text-white"
                  style={{ fontSize: '7px', minWidth: '82px', height: '18px', padding: '0 6px' }}
                >
                  SPACE
                </kbd>
                <span className="text-mc-yellow" style={{ fontSize: '7px' }}>
                  JUMP
                </span>
              </div>

              {/* Break block row */}
              <div className="flex items-center gap-2">
                <kbd
                  className="inline-flex items-center justify-center bg-mc-dirt border-b-2 border-mc-grass text-white"
                  style={{ fontSize: '7px', minWidth: '82px', height: '18px', padding: '0 6px' }}
                >
                  L-CLICK
                </kbd>
                <span className="text-mc-red" style={{ fontSize: '7px' }}>
                  BREAK
                </span>
              </div>

              {/* Place block row */}
              <div className="flex items-center gap-2">
                <kbd
                  className="inline-flex items-center justify-center bg-mc-dirt border-b-2 border-mc-grass text-white"
                  style={{ fontSize: '7px', minWidth: '82px', height: '18px', padding: '0 6px' }}
                >
                  R-CLICK
                </kbd>
                <span className="text-mc-green" style={{ fontSize: '7px' }}>
                  PLACE
                </span>
              </div>

              {/* Select block row */}
              <div className="flex items-center gap-2">
                <kbd
                  className="inline-flex items-center justify-center bg-mc-dirt border-b-2 border-mc-grass text-white"
                  style={{ fontSize: '7px', minWidth: '82px', height: '18px', padding: '0 6px' }}
                >
                  1 - 5
                </kbd>
                <span className="text-mc-yellow" style={{ fontSize: '7px' }}>
                  SELECT
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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

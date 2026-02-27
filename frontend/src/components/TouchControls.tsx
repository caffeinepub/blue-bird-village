import { useRef, useCallback } from 'react';
import { Music, Lightbulb, PersonStanding } from 'lucide-react';

export interface TouchMovement {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

interface TouchControlsProps {
  onMove: (movement: TouchMovement) => void;
  onJump: () => void;
  onToggleMusic: () => void;
  onToggleHints: () => void;
  isMuted: boolean;
}

const JOYSTICK_RADIUS = 70;
const THUMB_DEADZONE = 0.15;

export default function TouchControls({
  onMove,
  onJump,
  onToggleMusic,
  onToggleHints,
  isMuted,
}: TouchControlsProps) {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);
  const currentMovement = useRef<TouchMovement>({ forward: false, backward: false, left: false, right: false });

  const updateThumbPosition = useCallback((nx: number, ny: number) => {
    if (!thumbRef.current) return;
    const clampedX = Math.max(-1, Math.min(1, nx));
    const clampedY = Math.max(-1, Math.min(1, ny));
    const px = clampedX * JOYSTICK_RADIUS;
    const py = clampedY * JOYSTICK_RADIUS;
    thumbRef.current.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
  }, []);

  const resetThumb = useCallback(() => {
    if (!thumbRef.current) return;
    thumbRef.current.style.transform = 'translate(-50%, -50%)';
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== null) return;
    activePointerId.current = e.pointerId;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    if (!joystickBaseRef.current) return;

    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rawX = e.clientX - centerX;
    const rawY = e.clientY - centerY;
    const dist = Math.sqrt(rawX * rawX + rawY * rawY);
    const maxDist = JOYSTICK_RADIUS;

    let nx = rawX / maxDist;
    let ny = rawY / maxDist;

    if (dist > maxDist) {
      nx = rawX / dist;
      ny = rawY / dist;
    }

    updateThumbPosition(nx, ny);

    const movement: TouchMovement = {
      forward: ny < -THUMB_DEADZONE,
      backward: ny > THUMB_DEADZONE,
      left: nx < -THUMB_DEADZONE,
      right: nx > THUMB_DEADZONE,
    };

    currentMovement.current = movement;
    onMove(movement);
  }, [onMove, updateThumbPosition]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    activePointerId.current = null;
    resetThumb();
    const stopped: TouchMovement = { forward: false, backward: false, left: false, right: false };
    currentMovement.current = stopped;
    onMove(stopped);
  }, [onMove, resetThumb]);

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      style={{ zIndex: 20 }}
    >
      {/* Virtual Joystick - bottom left */}
      <div
        className="absolute pointer-events-auto"
        style={{ bottom: 32, left: 24 }}
      >
        {/* Outer ring */}
        <div
          ref={joystickBaseRef}
          className="relative flex items-center justify-center"
          style={{
            width: JOYSTICK_RADIUS * 2 + 20,
            height: JOYSTICK_RADIUS * 2 + 20,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.50)',
            border: '4px solid rgba(255,255,255,0.35)',
            boxShadow: '0 4px 0 rgba(0,0,0,0.6), 0 6px 24px rgba(0,0,0,0.5)',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Inner ring */}
          <div
            className="absolute"
            style={{
              width: JOYSTICK_RADIUS * 1.1,
              height: JOYSTICK_RADIUS * 1.1,
              borderRadius: '50%',
              background: 'rgba(30,80,180,0.40)',
              border: '2px solid rgba(100,160,255,0.45)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />

          {/* Directional arrows */}
          {/* Up */}
          <div
            className="absolute"
            style={{
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '12px solid rgba(255,255,255,0.75)',
              pointerEvents: 'none',
            }}
          />
          {/* Down */}
          <div
            className="absolute"
            style={{
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '12px solid rgba(255,255,255,0.75)',
              pointerEvents: 'none',
            }}
          />
          {/* Left */}
          <div
            className="absolute"
            style={{
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderRight: '12px solid rgba(255,255,255,0.75)',
              pointerEvents: 'none',
            }}
          />
          {/* Right */}
          <div
            className="absolute"
            style={{
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderLeft: '12px solid rgba(255,255,255,0.75)',
              pointerEvents: 'none',
            }}
          />

          {/* Thumb */}
          <div
            ref={thumbRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #ffffff, #d0d8f0)',
              border: '4px solid rgba(180,210,255,0.95)',
              boxShadow: '0 3px 0 rgba(0,0,0,0.5), 0 4px 14px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              transition: 'none',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(30,100,220,0.22)',
                border: '2px solid rgba(30,100,220,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  background: '#1E64DC',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - bottom right */}
      <div
        className="absolute pointer-events-auto flex flex-col items-end gap-4"
        style={{ bottom: 32, right: 24 }}
      >
        {/* Label row for jump */}
        <div className="flex flex-col items-center gap-1">
          <span
            style={{
              fontSize: '6px',
              color: 'rgba(255,220,0,0.9)',
              fontFamily: '"Press Start 2P", monospace',
              textShadow: '1px 1px 0 rgba(0,0,0,0.8)',
              letterSpacing: '0.05em',
            }}
          >
            JUMP
          </span>
          {/* Yellow - Jump */}
          <button
            className="mc-action-btn"
            onPointerDown={(e) => {
              e.preventDefault();
              onJump();
            }}
            style={{
              width: 72,
              height: 72,
              background: 'linear-gradient(145deg, #FFE033, #D4900A)',
              border: '4px solid #7A5200',
              borderTopColor: '#FFE880',
              borderLeftColor: '#FFE880',
              boxShadow: '0 5px 0 rgba(0,0,0,0.6), 0 7px 20px rgba(0,0,0,0.45)',
            }}
            aria-label="Jump"
          >
            <PersonStanding size={30} color="#3A2000" strokeWidth={2.5} />
          </button>
        </div>

        {/* Green (music) + Pink (hints) side by side */}
        <div className="flex gap-3">
          {/* Green - Music toggle */}
          <div className="flex flex-col items-center gap-1">
            <span
              style={{
                fontSize: '6px',
                color: isMuted ? 'rgba(200,200,200,0.8)' : 'rgba(100,255,120,0.9)',
                fontFamily: '"Press Start 2P", monospace',
                textShadow: '1px 1px 0 rgba(0,0,0,0.8)',
                letterSpacing: '0.05em',
              }}
            >
              {isMuted ? 'MUTED' : 'MUSIC'}
            </span>
            <button
              className="mc-action-btn"
              onPointerDown={(e) => {
                e.preventDefault();
                onToggleMusic();
              }}
              style={{
                width: 66,
                height: 66,
                background: isMuted
                  ? 'linear-gradient(145deg, #6a6a6a, #2e2e2e)'
                  : 'linear-gradient(145deg, #3DDB72, #0F6B2E)',
                border: isMuted ? '4px solid #1a1a1a' : '4px solid #064A1E',
                borderTopColor: isMuted ? '#888888' : '#6DFFA0',
                borderLeftColor: isMuted ? '#888888' : '#6DFFA0',
                boxShadow: '0 5px 0 rgba(0,0,0,0.6), 0 7px 20px rgba(0,0,0,0.45)',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              aria-label={isMuted ? 'Unmute music' : 'Mute music'}
            >
              <Music size={28} color={isMuted ? '#aaaaaa' : '#002A10'} strokeWidth={2.5} />
            </button>
          </div>

          {/* Pink - Toggle hints */}
          <div className="flex flex-col items-center gap-1">
            <span
              style={{
                fontSize: '6px',
                color: 'rgba(255,160,210,0.9)',
                fontFamily: '"Press Start 2P", monospace',
                textShadow: '1px 1px 0 rgba(0,0,0,0.8)',
                letterSpacing: '0.05em',
              }}
            >
              HINTS
            </span>
            <button
              className="mc-action-btn"
              onPointerDown={(e) => {
                e.preventDefault();
                onToggleHints();
              }}
              style={{
                width: 66,
                height: 66,
                background: 'linear-gradient(145deg, #FF7EC8, #A0105A)',
                border: '4px solid #6B0038',
                borderTopColor: '#FFB8E8',
                borderLeftColor: '#FFB8E8',
                boxShadow: '0 5px 0 rgba(0,0,0,0.6), 0 7px 20px rgba(0,0,0,0.45)',
              }}
              aria-label="Toggle hints"
            >
              <Lightbulb size={28} color="#3A0020" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

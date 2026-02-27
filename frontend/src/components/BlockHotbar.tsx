import { useEffect } from 'react';
import type { BlockType } from '../hooks/useBlockPlacement';
import { BLOCK_COLORS } from '../hooks/useBlockPlacement';

const BLOCK_TYPES: BlockType[] = ['grass', 'dirt', 'stone', 'log', 'leaf'];

const BLOCK_LABELS: Record<BlockType, string> = {
  grass: 'GRASS',
  dirt: 'DIRT',
  stone: 'STONE',
  log: 'LOG',
  leaf: 'LEAF',
};

const BLOCK_TOP_COLORS: Partial<Record<BlockType, string>> = {
  grass: '#56C45A',
  log: '#7A5230',
};

interface BlockHotbarProps {
  selectedBlockType: BlockType;
  onSelectBlockType: (type: BlockType) => void;
}

export default function BlockHotbar({ selectedBlockType, onSelectBlockType }: BlockHotbarProps) {
  // Keyboard shortcuts 1-5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < BLOCK_TYPES.length) {
        onSelectBlockType(BLOCK_TYPES[idx]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectBlockType]);

  return (
    <div
      className="absolute pointer-events-auto font-pixel"
      style={{
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 30,
      }}
    >
      <div
        className="flex gap-2 px-3 py-2"
        style={{
          background: 'rgba(10, 8, 4, 0.90)',
          borderTop: '3px solid rgba(180, 140, 80, 0.9)',
          borderLeft: '3px solid rgba(180, 140, 80, 0.9)',
          borderBottom: '3px solid rgba(60, 40, 10, 0.95)',
          borderRight: '3px solid rgba(60, 40, 10, 0.95)',
          boxShadow: '0 5px 0 rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.55)',
        }}
      >
        {BLOCK_TYPES.map((type, idx) => {
          const isSelected = selectedBlockType === type;
          const baseColor = BLOCK_COLORS[type];
          const topColor = BLOCK_TOP_COLORS[type] ?? baseColor;

          return (
            <button
              key={type}
              onClick={() => onSelectBlockType(type)}
              title={`${BLOCK_LABELS[type]} (${idx + 1})`}
              className="hotbar-slot"
              style={{
                width: 56,
                height: 56,
                padding: 0,
                background: 'transparent',
                borderTop: isSelected
                  ? '4px solid #FFE880'
                  : '3px solid rgba(160, 120, 60, 0.85)',
                borderLeft: isSelected
                  ? '4px solid #FFE880'
                  : '3px solid rgba(160, 120, 60, 0.85)',
                borderBottom: isSelected
                  ? '4px solid #A06800'
                  : '3px solid rgba(40, 25, 5, 0.9)',
                borderRight: isSelected
                  ? '4px solid #A06800'
                  : '3px solid rgba(40, 25, 5, 0.9)',
                boxShadow: isSelected
                  ? '0 0 12px 3px rgba(255, 215, 0, 0.7), inset 0 0 6px rgba(255,215,0,0.25), 0 4px 0 rgba(0,0,0,0.6)'
                  : '0 3px 0 rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {/* Block icon */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: baseColor,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top face highlight */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '35%',
                    background: topColor,
                    opacity: 0.9,
                  }}
                />
                {/* Side shadow */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '25%',
                    background: 'rgba(0,0,0,0.35)',
                  }}
                />
                {/* Number label */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    right: 3,
                    fontSize: '7px',
                    color: 'rgba(255,255,255,0.95)',
                    fontFamily: '"Press Start 2P", monospace',
                    textShadow: '1px 1px 0 #000, -1px -1px 0 #000',
                    lineHeight: 1,
                  }}
                >
                  {idx + 1}
                </div>
              </div>

              {/* Block name tooltip on selected */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '110%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(10,8,4,0.95)',
                    borderTop: '2px solid #FFE880',
                    borderLeft: '2px solid #FFE880',
                    borderBottom: '2px solid #A06800',
                    borderRight: '2px solid #A06800',
                    padding: '4px 8px',
                    whiteSpace: 'nowrap',
                    fontSize: '6px',
                    color: '#FFD700',
                    fontFamily: '"Press Start 2P", monospace',
                    pointerEvents: 'none',
                    boxShadow: '0 3px 0 rgba(0,0,0,0.6)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {BLOCK_LABELS[type]}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {/* Hint text */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 5,
          fontSize: '6px',
          color: 'rgba(255,255,255,0.55)',
          fontFamily: '"Press Start 2P", monospace',
          letterSpacing: '0.05em',
          textShadow: '1px 1px 0 rgba(0,0,0,0.8)',
        }}
      >
        LEFT CLICK: BREAK · RIGHT CLICK: PLACE
      </div>
    </div>
  );
}

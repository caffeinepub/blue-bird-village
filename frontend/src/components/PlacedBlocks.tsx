import { useRef } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import type { PlacedBlock, BlockType } from '../hooks/useBlockPlacement';
import { BLOCK_COLORS } from '../hooks/useBlockPlacement';

interface PlacedBlockMeshProps {
  block: PlacedBlock;
  onPointerDown: (e: ThreeEvent<PointerEvent>, id: string) => void;
}

const BLOCK_TOP_COLORS: Partial<Record<BlockType, string>> = {
  grass: '#56C45A',
  log: '#7A5230',
};

function PlacedBlockMesh({ block, onPointerDown }: PlacedBlockMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = BLOCK_COLORS[block.blockType];

  return (
    <mesh
      ref={meshRef}
      position={block.position}
      castShadow
      receiveShadow
      onPointerDown={(e) => {
        onPointerDown(e, block.id);
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
}

interface PlacedBlocksProps {
  blocks: PlacedBlock[];
  onPointerDown: (e: ThreeEvent<PointerEvent>, id: string) => void;
}

export default function PlacedBlocks({ blocks, onPointerDown }: PlacedBlocksProps) {
  if (blocks.length === 0) return null;

  return (
    <group>
      {blocks.map((block) => (
        <PlacedBlockMesh key={block.id} block={block} onPointerDown={onPointerDown} />
      ))}
    </group>
  );
}

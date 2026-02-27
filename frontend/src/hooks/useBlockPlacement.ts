import { useState, useCallback } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';

export type BlockType = 'grass' | 'dirt' | 'stone' | 'log' | 'leaf';

export interface PlacedBlock {
  id: string;
  position: [number, number, number];
  blockType: BlockType;
}

export const BLOCK_COLORS: Record<BlockType, string> = {
  grass: '#4CAF50',
  dirt: '#8B5E3C',
  stone: '#9E9E9E',
  log: '#5C3A1E',
  leaf: '#66BB6A',
};

let blockIdCounter = 0;

function snapToGrid(v: number): number {
  return Math.round(v);
}

export function useBlockPlacement(selectedBlockType: BlockType) {
  const [blocks, setBlocks] = useState<PlacedBlock[]>([]);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const addBlock = useCallback(
    (position: [number, number, number]) => {
      const snapped: [number, number, number] = [
        snapToGrid(position[0]),
        snapToGrid(position[1]),
        snapToGrid(position[2]),
      ];
      // Prevent placing below ground
      if (snapped[1] < 1) snapped[1] = 1;
      // Clamp within terrain bounds
      snapped[0] = Math.max(-14, Math.min(14, snapped[0]));
      snapped[2] = Math.max(-14, Math.min(14, snapped[2]));

      const id = `block-${++blockIdCounter}`;
      setBlocks((prev) => [...prev, { id, position: snapped, blockType: selectedBlockType }]);
    },
    [selectedBlockType]
  );

  const handleBlockPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>, blockId: string) => {
      if (e.button === 0) {
        // Left click: break block
        e.stopPropagation();
        removeBlock(blockId);
      } else if (e.button === 2) {
        // Right click: place block on face
        e.stopPropagation();
        const face = e.face as THREE.Face | null;
        const object = e.object as THREE.Mesh;
        if (face && object) {
          const normal = face.normal.clone();
          // Transform normal to world space
          const normalMatrix = new THREE.Matrix3().getNormalMatrix(object.matrixWorld);
          normal.applyMatrix3(normalMatrix).normalize();
          // Find the block's world position
          const blockPos = new THREE.Vector3();
          object.getWorldPosition(blockPos);
          const newPos: [number, number, number] = [
            blockPos.x + Math.round(normal.x),
            blockPos.y + Math.round(normal.y),
            blockPos.z + Math.round(normal.z),
          ];
          addBlock(newPos);
        }
      }
    },
    [removeBlock, addBlock]
  );

  const handleTerrainPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (e.button === 2) {
        e.stopPropagation();
        const face = e.face as THREE.Face | null;
        const object = e.object as THREE.Mesh;
        if (face && object) {
          const normal = face.normal.clone();
          const normalMatrix = new THREE.Matrix3().getNormalMatrix(object.matrixWorld);
          normal.applyMatrix3(normalMatrix).normalize();
          const blockPos = new THREE.Vector3();
          object.getWorldPosition(blockPos);
          const newPos: [number, number, number] = [
            blockPos.x + Math.round(normal.x),
            blockPos.y + Math.round(normal.y),
            blockPos.z + Math.round(normal.z),
          ];
          addBlock(newPos);
        }
      }
    },
    [addBlock]
  );

  return {
    blocks,
    addBlock,
    removeBlock,
    handleBlockPointerDown,
    handleTerrainPointerDown,
  };
}

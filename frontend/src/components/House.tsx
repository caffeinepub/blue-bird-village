import { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

interface HouseProps {
  position: [number, number, number];
  rotation?: number;
  size?: number;
}

export default function House({ position, rotation = 0, size = 1 }: HouseProps) {
  const woodTexture = useLoader(TextureLoader, '/assets/generated/wood-plank-tile.dim_64x64.png');
  const stoneTexture = useLoader(TextureLoader, '/assets/generated/stone-brick-tile.dim_64x64.png');

  const woodTex = useMemo(() => {
    const t = woodTexture.clone();
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.needsUpdate = true;
    return t;
  }, [woodTexture]);

  const stoneTex = useMemo(() => {
    const t = stoneTexture.clone();
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.needsUpdate = true;
    return t;
  }, [stoneTexture]);

  const w = 3 * size;
  const h = 2.5 * size;
  const d = 3 * size;
  const baseH = 0.5 * size;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Stone foundation */}
      <mesh position={[0, baseH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, baseH, d]} />
        <meshLambertMaterial map={stoneTex} />
      </mesh>

      {/* Wooden walls */}
      <mesh position={[0, baseH + h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshLambertMaterial map={woodTex} />
      </mesh>

      {/* Roof lower */}
      <mesh position={[0, baseH + h + 0.4 * size, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.5 * size, 0.8 * size, d + 0.5 * size]} />
        <meshLambertMaterial color="#7B2D00" />
      </mesh>

      {/* Roof upper ridge */}
      <mesh position={[0, baseH + h + 0.9 * size, 0]} castShadow receiveShadow>
        <boxGeometry args={[w - 0.4 * size, 0.5 * size, d + 0.5 * size]} />
        <meshLambertMaterial color="#5C1F00" />
      </mesh>

      {/* Door */}
      <mesh position={[0, baseH + 0.65 * size, d / 2 + 0.02]} castShadow>
        <boxGeometry args={[0.65 * size, 1.3 * size, 0.06]} />
        <meshLambertMaterial color="#3D1F00" />
      </mesh>

      {/* Door handle */}
      <mesh position={[0.22 * size, baseH + 0.6 * size, d / 2 + 0.06]}>
        <boxGeometry args={[0.08 * size, 0.08 * size, 0.06]} />
        <meshLambertMaterial color="#C8A000" />
      </mesh>

      {/* Window front left */}
      <mesh position={[-0.9 * size, baseH + h * 0.55, d / 2 + 0.02]}>
        <boxGeometry args={[0.55 * size, 0.55 * size, 0.06]} />
        <meshLambertMaterial color="#87CEEB" />
      </mesh>

      {/* Window front right */}
      <mesh position={[0.9 * size, baseH + h * 0.55, d / 2 + 0.02]}>
        <boxGeometry args={[0.55 * size, 0.55 * size, 0.06]} />
        <meshLambertMaterial color="#87CEEB" />
      </mesh>

      {/* Window back */}
      <mesh position={[0, baseH + h * 0.55, -d / 2 - 0.02]}>
        <boxGeometry args={[0.55 * size, 0.55 * size, 0.06]} />
        <meshLambertMaterial color="#87CEEB" />
      </mesh>
    </group>
  );
}

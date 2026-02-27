import { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

const GRID_SIZE = 32;
const BLOCK_SIZE = 1;

export default function Terrain() {
  const texture = useLoader(TextureLoader, '/assets/generated/grass-dirt-tile.dim_64x64.png');

  const tex = useMemo(() => {
    const t = texture.clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.needsUpdate = true;
    return t;
  }, [texture]);

  const { positions, count } = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let x = -GRID_SIZE / 2; x < GRID_SIZE / 2; x++) {
      for (let z = -GRID_SIZE / 2; z < GRID_SIZE / 2; z++) {
        pos.push([x * BLOCK_SIZE, -0.5, z * BLOCK_SIZE]);
      }
    }
    return { positions: pos, count: pos.length };
  }, []);

  const instancedMesh = useMemo(() => {
    const geometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    const material = new THREE.MeshLambertMaterial({ map: tex });
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    const matrix = new THREE.Matrix4();
    positions.forEach(([x, y, z], i) => {
      matrix.setPosition(x, y, z);
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    return mesh;
  }, [positions, count, tex]);

  return <primitive object={instancedMesh} />;
}

import { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import BlueBird, { BlueBirdHandle } from './BlueBird';
import Terrain from './Terrain';
import House from './House';
import Tree from './Tree';
import Sky from './Sky';
import FollowCamera from './FollowCamera';
import GameHUD from './GameHUD';
import { useAudio } from '../hooks/useAudio';

function PathBlocks() {
  const pathPositions: [number, number, number][] = [];

  // North-south path
  for (let z = -13; z <= 13; z++) {
    pathPositions.push([0, -0.48, z]);
    pathPositions.push([1, -0.48, z]);
  }
  // East-west path
  for (let x = -10; x <= 10; x++) {
    if (x !== 0 && x !== 1) {
      pathPositions.push([x, -0.48, 0]);
      pathPositions.push([x, -0.48, 1]);
    }
  }

  return (
    <>
      {pathPositions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} receiveShadow>
          <boxGeometry args={[1, 0.06, 1]} />
          <meshLambertMaterial color="#8B8B7A" />
        </mesh>
      ))}
    </>
  );
}

function VillageContent({
  birdRef,
  onPositionChange,
}: {
  birdRef: React.RefObject<BlueBirdHandle | null>;
  onPositionChange: (pos: THREE.Vector3) => void;
}) {
  return (
    <>
      <Sky />

      {/* Lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[35, 45, -55]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={120}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
      />
      <hemisphereLight args={['#87CEEB', '#4a7c59', 0.35]} />

      {/* Terrain */}
      <Suspense fallback={null}>
        <Terrain />
      </Suspense>

      {/* Stone path */}
      <PathBlocks />

      {/* Houses - spread around the village */}
      <Suspense fallback={null}>
        <House position={[-7, 0, -7]} rotation={0.3} size={1} />
        <House position={[7, 0, -9]} rotation={-0.25} size={1.2} />
        <House position={[-9, 0, 5]} rotation={0.85} size={0.9} />
        <House position={[9, 0, 6]} rotation={-0.5} size={1.1} />
        <House position={[0, 0, -13]} rotation={0.1} size={1.3} />
        <House position={[-4, 0, 10]} rotation={1.2} size={0.85} />
      </Suspense>

      {/* Trees scattered around */}
      <Suspense fallback={null}>
        <Tree position={[-3.5, 0, -3.5]} scale={0.9} />
        <Tree position={[3.5, 0, -4.5]} scale={1.1} />
        <Tree position={[-11, 0, -3]} scale={1.2} />
        <Tree position={[11, 0, 3]} scale={0.85} />
        <Tree position={[-5.5, 0, 8]} scale={1.0} />
        <Tree position={[6, 0, 9.5]} scale={1.3} />
        <Tree position={[-13, 0, 9]} scale={0.9} />
        <Tree position={[13, 0, -6]} scale={1.1} />
        <Tree position={[2, 0, 11]} scale={1.0} />
        <Tree position={[-8, 0, -11]} scale={0.85} />
        <Tree position={[10, 0, -12]} scale={1.0} />
        <Tree position={[-13, 0, -8]} scale={1.15} />
      </Suspense>

      {/* Blue Bird Player */}
      <BlueBird ref={birdRef} onPositionChange={onPositionChange} />

      {/* Follow Camera */}
      <FollowCamera target={birdRef} />
    </>
  );
}

export default function Village3DScene() {
  const birdRef = useRef<BlueBirdHandle>(null);
  const [birdPosition, setBirdPosition] = useState(() => new THREE.Vector3(0, 0.5, 0));
  const { isMuted, toggleMute } = useAudio();

  const handlePositionChange = useCallback((pos: THREE.Vector3) => {
    setBirdPosition(pos);
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 6, 11], fov: 70, near: 0.1, far: 200 }}
        gl={{ antialias: true }}
        style={{ background: '#5BA3E0', display: 'block', width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Suspense fallback={null}>
          <VillageContent birdRef={birdRef} onPositionChange={handlePositionChange} />
        </Suspense>
      </Canvas>

      <GameHUD birdPosition={birdPosition} isMuted={isMuted} onToggleMute={toggleMute} />
    </div>
  );
}

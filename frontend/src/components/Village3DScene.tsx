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
import TouchControls, { TouchMovement } from './TouchControls';
import PlacedBlocks from './PlacedBlocks';
import BlockHotbar from './BlockHotbar';
import Cow from './animals/Cow';
import Pig from './animals/Pig';
import Chicken from './animals/Chicken';
import { useAudio } from '../hooks/useAudio';
import { useBlockPlacement, BlockType } from '../hooks/useBlockPlacement';

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

// Prevent browser context menu on right-click inside canvas
function ContextMenuBlocker() {
  return null;
}

function VillageContent({
  birdRef,
  onPositionChange,
  touchMovementRef,
  touchJumpRef,
  selectedBlockType,
}: {
  birdRef: React.RefObject<BlueBirdHandle | null>;
  onPositionChange: (pos: THREE.Vector3) => void;
  touchMovementRef: React.RefObject<TouchMovement>;
  touchJumpRef: React.RefObject<boolean>;
  selectedBlockType: BlockType;
}) {
  const { blocks, handleBlockPointerDown, handleTerrainPointerDown } = useBlockPlacement(selectedBlockType);

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

      {/* Animals */}
      <Cow initialPosition={{ x: 5, z: 5 }} />
      <Cow initialPosition={{ x: 20, z: 10 }} />
      <Pig initialPosition={{ x: 8, z: 15 }} />
      <Pig initialPosition={{ x: 18, z: 8 }} />
      <Pig initialPosition={{ x: 12, z: 25 }} />
      <Chicken initialPosition={{ x: 10, z: 20 }} />
      <Chicken initialPosition={{ x: 22, z: 18 }} />
      <Chicken initialPosition={{ x: 6, z: 12 }} />

      {/* Placed blocks */}
      <PlacedBlocks blocks={blocks} onPointerDown={handleBlockPointerDown} />

      {/* Blue Bird Player */}
      <BlueBird
        ref={birdRef}
        onPositionChange={onPositionChange}
        touchMovementRef={touchMovementRef}
        touchJumpRef={touchJumpRef}
      />

      {/* Follow Camera */}
      <FollowCamera target={birdRef} />
    </>
  );
}

export default function Village3DScene() {
  const birdRef = useRef<BlueBirdHandle>(null);
  const [birdPosition, setBirdPosition] = useState(() => new THREE.Vector3(0, 0.5, 0));
  const { isMuted, toggleMute } = useAudio();
  const [showHints, setShowHints] = useState(true);
  const [selectedBlockType, setSelectedBlockType] = useState<BlockType>('grass');

  // Touch input refs — updated by TouchControls, read by BlueBird in useFrame
  const touchMovementRef = useRef<TouchMovement>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const touchJumpRef = useRef<boolean>(false);
  // Timer ref to auto-release the jump signal after one frame
  const jumpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePositionChange = useCallback((pos: THREE.Vector3) => {
    setBirdPosition(pos);
  }, []);

  const handleTouchMove = useCallback((movement: TouchMovement) => {
    touchMovementRef.current = movement;
  }, []);

  const handleTouchJump = useCallback(() => {
    // Set jump signal for a short window so BlueBird's useFrame picks it up
    touchJumpRef.current = true;
    if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
    jumpTimerRef.current = setTimeout(() => {
      touchJumpRef.current = false;
    }, 150);
  }, []);

  const handleToggleHints = useCallback(() => {
    setShowHints((prev) => !prev);
  }, []);

  // Prevent browser context menu on right-click inside the canvas
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="relative w-full h-full" onContextMenu={handleContextMenu}>
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
          <VillageContent
            birdRef={birdRef}
            onPositionChange={handlePositionChange}
            touchMovementRef={touchMovementRef}
            touchJumpRef={touchJumpRef}
            selectedBlockType={selectedBlockType}
          />
        </Suspense>
      </Canvas>

      {/* HUD overlay */}
      <GameHUD
        birdPosition={birdPosition}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        showHints={showHints}
      />

      {/* Block hotbar */}
      <BlockHotbar
        selectedBlockType={selectedBlockType}
        onSelectBlockType={setSelectedBlockType}
      />

      {/* Touch controls overlay */}
      <TouchControls
        onMove={handleTouchMove}
        onJump={handleTouchJump}
        onToggleMusic={toggleMute}
        onToggleHints={handleToggleHints}
        isMuted={isMuted}
      />
    </div>
  );
}

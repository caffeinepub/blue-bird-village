import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChickenProps {
  initialPosition: { x: number; z: number };
}

const TERRAIN_HALF = 14;
const GROUND_Y = 0.5;
const SPEED = 0.022;

export default function Chicken({ initialPosition }: ChickenProps) {
  const groupRef = useRef<THREE.Group>(null);
  const direction = useRef(Math.random() * Math.PI * 2);
  const moveTimer = useRef(Math.random() * 2 + 1);
  const pauseTimer = useRef(0);
  const isPaused = useRef(false);
  const legTime = useRef(Math.random() * Math.PI * 2);
  const bobTime = useRef(0);
  const legLRef = useRef<THREE.Mesh>(null);
  const legRRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (isPaused.current) {
      pauseTimer.current -= delta;
      if (pauseTimer.current <= 0) {
        isPaused.current = false;
        direction.current = Math.random() * Math.PI * 2;
        moveTimer.current = Math.random() * 2 + 1;
      }
      // Idle head bob
      bobTime.current += delta * 3;
      if (headRef.current) {
        headRef.current.position.y = 0.62 + Math.sin(bobTime.current) * 0.03;
      }
      return;
    }

    moveTimer.current -= delta;
    if (moveTimer.current <= 0) {
      isPaused.current = true;
      pauseTimer.current = Math.random() * 1.0 + 0.3;
      return;
    }

    const dx = Math.sin(direction.current) * SPEED;
    const dz = Math.cos(direction.current) * SPEED;

    const pos = groupRef.current.position;
    const newX = pos.x + dx;
    const newZ = pos.z + dz;

    if (Math.abs(newX) > TERRAIN_HALF || Math.abs(newZ) > TERRAIN_HALF) {
      direction.current += Math.PI + (Math.random() - 0.5) * 0.5;
    } else {
      pos.x = newX;
      pos.z = newZ;
    }

    pos.y = GROUND_Y;
    groupRef.current.rotation.y = direction.current;

    // Leg animation
    legTime.current += delta * 10;
    const legSwing = Math.sin(legTime.current) * 0.4;
    if (legLRef.current) legLRef.current.rotation.x = legSwing;
    if (legRRef.current) legRRef.current.rotation.x = -legSwing;

    // Head bob while walking
    bobTime.current += delta * 8;
    if (headRef.current) {
      headRef.current.position.y = 0.62 + Math.sin(bobTime.current) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[initialPosition.x, GROUND_Y, initialPosition.z]}>
      {/* Body */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.7]} />
        <meshLambertMaterial color="#f5f5f5" />
      </mesh>
      {/* Head */}
      <mesh ref={headRef} position={[0, 0.62, 0.38]} castShadow>
        <boxGeometry args={[0.38, 0.38, 0.38]} />
        <meshLambertMaterial color="#f5f5f5" />
      </mesh>
      {/* Comb (red) */}
      <mesh position={[0, 0.88, 0.36]}>
        <boxGeometry args={[0.12, 0.18, 0.12]} />
        <meshLambertMaterial color="#FF2020" />
      </mesh>
      {/* Wattle (red chin) */}
      <mesh position={[0, 0.52, 0.56]}>
        <boxGeometry args={[0.1, 0.12, 0.08]} />
        <meshLambertMaterial color="#FF2020" />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0.6, 0.6]}>
        <boxGeometry args={[0.12, 0.08, 0.12]} />
        <meshLambertMaterial color="#FFA500" />
      </mesh>
      {/* Eye left */}
      <mesh position={[-0.16, 0.66, 0.56]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Eye right */}
      <mesh position={[0.16, 0.66, 0.56]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Wing left */}
      <mesh position={[-0.3, 0.24, 0]}>
        <boxGeometry args={[0.12, 0.3, 0.5]} />
        <meshLambertMaterial color="#e0e0e0" />
      </mesh>
      {/* Wing right */}
      <mesh position={[0.3, 0.24, 0]}>
        <boxGeometry args={[0.12, 0.3, 0.5]} />
        <meshLambertMaterial color="#e0e0e0" />
      </mesh>
      {/* Tail feathers */}
      <mesh position={[0, 0.3, -0.42]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.3, 0.22, 0.18]} />
        <meshLambertMaterial color="#e8e8e8" />
      </mesh>
      {/* Left Leg */}
      <mesh ref={legLRef} position={[-0.12, -0.08, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.32, 0.1]} />
        <meshLambertMaterial color="#FFA500" />
      </mesh>
      {/* Right Leg */}
      <mesh ref={legRRef} position={[0.12, -0.08, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.32, 0.1]} />
        <meshLambertMaterial color="#FFA500" />
      </mesh>
      {/* Left foot */}
      <mesh position={[-0.12, -0.26, 0.1]}>
        <boxGeometry args={[0.18, 0.06, 0.2]} />
        <meshLambertMaterial color="#FFA500" />
      </mesh>
      {/* Right foot */}
      <mesh position={[0.12, -0.26, 0.1]}>
        <boxGeometry args={[0.18, 0.06, 0.2]} />
        <meshLambertMaterial color="#FFA500" />
      </mesh>
    </group>
  );
}

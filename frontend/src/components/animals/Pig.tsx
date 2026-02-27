import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PigProps {
  initialPosition: { x: number; z: number };
}

const TERRAIN_HALF = 14;
const GROUND_Y = 0.5;
const SPEED = 0.016;

export default function Pig({ initialPosition }: PigProps) {
  const groupRef = useRef<THREE.Group>(null);
  const direction = useRef(Math.random() * Math.PI * 2);
  const moveTimer = useRef(Math.random() * 3 + 1.5);
  const pauseTimer = useRef(0);
  const isPaused = useRef(false);
  const legTime = useRef(Math.random() * Math.PI * 2);
  const legFLRef = useRef<THREE.Mesh>(null);
  const legFRRef = useRef<THREE.Mesh>(null);
  const legBLRef = useRef<THREE.Mesh>(null);
  const legBRRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (isPaused.current) {
      pauseTimer.current -= delta;
      if (pauseTimer.current <= 0) {
        isPaused.current = false;
        direction.current = Math.random() * Math.PI * 2;
        moveTimer.current = Math.random() * 3 + 1.5;
      }
      return;
    }

    moveTimer.current -= delta;
    if (moveTimer.current <= 0) {
      isPaused.current = true;
      pauseTimer.current = Math.random() * 1.2 + 0.4;
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
    legTime.current += delta * 7;
    const legSwing = Math.sin(legTime.current) * 0.35;
    if (legFLRef.current) legFLRef.current.rotation.x = legSwing;
    if (legFRRef.current) legFRRef.current.rotation.x = -legSwing;
    if (legBLRef.current) legBLRef.current.rotation.x = -legSwing;
    if (legBRRef.current) legBRRef.current.rotation.x = legSwing;
  });

  return (
    <group ref={groupRef} position={[initialPosition.x, GROUND_Y, initialPosition.z]}>
      {/* Body */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[0.75, 0.6, 1.1]} />
        <meshLambertMaterial color="#F4A0B0" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.55, 0.68]} castShadow>
        <boxGeometry args={[0.58, 0.52, 0.5]} />
        <meshLambertMaterial color="#F4A0B0" />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.48, 0.95]}>
        <boxGeometry args={[0.32, 0.22, 0.12]} />
        <meshLambertMaterial color="#E8809A" />
      </mesh>
      {/* Snout nostrils */}
      <mesh position={[-0.08, 0.48, 1.02]}>
        <boxGeometry args={[0.07, 0.07, 0.02]} />
        <meshBasicMaterial color="#c06070" />
      </mesh>
      <mesh position={[0.08, 0.48, 1.02]}>
        <boxGeometry args={[0.07, 0.07, 0.02]} />
        <meshBasicMaterial color="#c06070" />
      </mesh>
      {/* Eye left */}
      <mesh position={[-0.2, 0.62, 0.92]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Eye right */}
      <mesh position={[0.2, 0.62, 0.92]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.28, 0.82, 0.65]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.14, 0.18, 0.08]} />
        <meshLambertMaterial color="#E8809A" />
      </mesh>
      <mesh position={[0.28, 0.82, 0.65]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.14, 0.18, 0.08]} />
        <meshLambertMaterial color="#E8809A" />
      </mesh>
      {/* Front Left Leg */}
      <mesh ref={legFLRef} position={[-0.22, -0.1, 0.32]} castShadow>
        <boxGeometry args={[0.2, 0.48, 0.2]} />
        <meshLambertMaterial color="#F4A0B0" />
      </mesh>
      {/* Front Right Leg */}
      <mesh ref={legFRRef} position={[0.22, -0.1, 0.32]} castShadow>
        <boxGeometry args={[0.2, 0.48, 0.2]} />
        <meshLambertMaterial color="#F4A0B0" />
      </mesh>
      {/* Back Left Leg */}
      <mesh ref={legBLRef} position={[-0.22, -0.1, -0.32]} castShadow>
        <boxGeometry args={[0.2, 0.48, 0.2]} />
        <meshLambertMaterial color="#F4A0B0" />
      </mesh>
      {/* Back Right Leg */}
      <mesh ref={legBRRef} position={[0.22, -0.1, -0.32]} castShadow>
        <boxGeometry args={[0.2, 0.48, 0.2]} />
        <meshLambertMaterial color="#F4A0B0" />
      </mesh>
      {/* Curly tail */}
      <mesh position={[0, 0.35, -0.6]} rotation={[0.4, 0, 0.4]}>
        <boxGeometry args={[0.1, 0.22, 0.1]} />
        <meshLambertMaterial color="#E8809A" />
      </mesh>
    </group>
  );
}

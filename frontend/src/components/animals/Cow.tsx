import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CowProps {
  initialPosition: { x: number; z: number };
}

const TERRAIN_HALF = 14;
const GROUND_Y = 0.5;
const SPEED = 0.018;

export default function Cow({ initialPosition }: CowProps) {
  const groupRef = useRef<THREE.Group>(null);
  const direction = useRef(Math.random() * Math.PI * 2);
  const moveTimer = useRef(Math.random() * 3 + 2);
  const pauseTimer = useRef(0);
  const isPaused = useRef(false);
  const legTime = useRef(0);
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
        moveTimer.current = Math.random() * 3 + 2;
      }
      return;
    }

    moveTimer.current -= delta;
    if (moveTimer.current <= 0) {
      isPaused.current = true;
      pauseTimer.current = Math.random() * 1.5 + 0.5;
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
    legTime.current += delta * 6;
    const legSwing = Math.sin(legTime.current) * 0.3;
    if (legFLRef.current) legFLRef.current.rotation.x = legSwing;
    if (legFRRef.current) legFRRef.current.rotation.x = -legSwing;
    if (legBLRef.current) legBLRef.current.rotation.x = -legSwing;
    if (legBRRef.current) legBRRef.current.rotation.x = legSwing;
  });

  return (
    <group ref={groupRef} position={[initialPosition.x, GROUND_Y, initialPosition.z]}>
      {/* Body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.9, 0.65, 1.4]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      {/* White patch on body */}
      <mesh position={[0, 0.45, 0.1]}>
        <boxGeometry args={[0.5, 0.35, 0.6]} />
        <meshLambertMaterial color="#f0f0f0" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.65, 0.85]} castShadow>
        <boxGeometry args={[0.6, 0.55, 0.55]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      {/* White face patch */}
      <mesh position={[0, 0.62, 1.1]}>
        <boxGeometry args={[0.35, 0.3, 0.05]} />
        <meshLambertMaterial color="#f0f0f0" />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.55, 1.14]}>
        <boxGeometry args={[0.28, 0.18, 0.08]} />
        <meshLambertMaterial color="#d4a0a0" />
      </mesh>
      {/* Eye left */}
      <mesh position={[-0.22, 0.72, 1.1]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Eye right */}
      <mesh position={[0.22, 0.72, 1.1]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Horns */}
      <mesh position={[-0.22, 0.98, 0.82]}>
        <boxGeometry args={[0.08, 0.18, 0.08]} />
        <meshLambertMaterial color="#d4c080" />
      </mesh>
      <mesh position={[0.22, 0.98, 0.82]}>
        <boxGeometry args={[0.08, 0.18, 0.08]} />
        <meshLambertMaterial color="#d4c080" />
      </mesh>
      {/* Front Left Leg */}
      <mesh ref={legFLRef} position={[-0.28, -0.12, 0.42]} castShadow>
        <boxGeometry args={[0.22, 0.55, 0.22]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      {/* Front Right Leg */}
      <mesh ref={legFRRef} position={[0.28, -0.12, 0.42]} castShadow>
        <boxGeometry args={[0.22, 0.55, 0.22]} />
        <meshLambertMaterial color="#f0f0f0" />
      </mesh>
      {/* Back Left Leg */}
      <mesh ref={legBLRef} position={[-0.28, -0.12, -0.42]} castShadow>
        <boxGeometry args={[0.22, 0.55, 0.22]} />
        <meshLambertMaterial color="#f0f0f0" />
      </mesh>
      {/* Back Right Leg */}
      <mesh ref={legBRRef} position={[0.28, -0.12, -0.42]} castShadow>
        <boxGeometry args={[0.22, 0.55, 0.22]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 0.38, -0.75]}>
        <boxGeometry args={[0.1, 0.28, 0.1]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      {/* Tail tuft */}
      <mesh position={[0, 0.2, -0.82]}>
        <boxGeometry args={[0.14, 0.14, 0.14]} />
        <meshLambertMaterial color="#f0f0f0" />
      </mesh>
    </group>
  );
}

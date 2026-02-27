import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import type { TouchMovement } from './TouchControls';

export interface BlueBirdHandle {
  getPosition: () => THREE.Vector3;
  jump: () => void;
}

interface BlueBirdProps {
  onPositionChange?: (pos: THREE.Vector3) => void;
  touchMovementRef?: React.RefObject<TouchMovement>;
  touchJumpRef?: React.RefObject<boolean>;
}

const MOVE_SPEED = 5.5;
const JUMP_FORCE = 7;
const GRAVITY = -18;
const GROUND_Y = 0.5;
const TERRAIN_HALF = 14.5;

const BlueBird = forwardRef<BlueBirdHandle, BlueBirdProps>(
  ({ onPositionChange, touchMovementRef, touchJumpRef }, ref) => {
    const groupRef = useRef<THREE.Group>(null);
    const velocityY = useRef(0);
    const isOnGround = useRef(true);
    const jumpConsumed = useRef(false);
    const facingAngle = useRef(0);
    const wingTime = useRef(0);
    const leftWingRef = useRef<THREE.Mesh>(null);
    const rightWingRef = useRef<THREE.Mesh>(null);
    const bodyRef = useRef<THREE.Mesh>(null);

    // keysRef.current always has the latest keyboard state — no stale closure
    const keysRef = useKeyboardControls();

    useImperativeHandle(ref, () => ({
      getPosition: () => {
        if (groupRef.current) return groupRef.current.position.clone();
        return new THREE.Vector3(0, GROUND_Y, 0);
      },
      jump: () => {
        if (isOnGround.current && !jumpConsumed.current) {
          velocityY.current = JUMP_FORCE;
          isOnGround.current = false;
          jumpConsumed.current = true;
        }
      },
    }));

    useFrame((_, delta) => {
      if (!groupRef.current) return;

      // Read directly from ref — always current, never stale
      const keys = keysRef.current;
      const touch = touchMovementRef?.current;
      const touchJump = touchJumpRef?.current ?? false;

      const pos = groupRef.current.position;
      let dx = 0;
      let dz = 0;

      // Merge keyboard + touch input
      if (keys.forward || touch?.forward) dz -= 1;
      if (keys.backward || touch?.backward) dz += 1;
      if (keys.left || touch?.left) dx -= 1;
      if (keys.right || touch?.right) dx += 1;

      const moving = dx !== 0 || dz !== 0;

      if (moving) {
        const len = Math.sqrt(dx * dx + dz * dz);
        dx = (dx / len) * MOVE_SPEED * delta;
        dz = (dz / len) * MOVE_SPEED * delta;
        facingAngle.current = Math.atan2(dx, dz);
      }

      // Jump logic — keyboard OR touch jump
      const wantsJump = keys.jump || touchJump;
      if (wantsJump && isOnGround.current && !jumpConsumed.current) {
        velocityY.current = JUMP_FORCE;
        isOnGround.current = false;
        jumpConsumed.current = true;
      }
      if (!wantsJump) {
        jumpConsumed.current = false;
      }

      // Apply gravity
      if (!isOnGround.current) {
        velocityY.current += GRAVITY * delta;
      }

      // Update position
      pos.x = Math.max(-TERRAIN_HALF, Math.min(TERRAIN_HALF, pos.x + dx));
      pos.z = Math.max(-TERRAIN_HALF, Math.min(TERRAIN_HALF, pos.z + dz));
      pos.y += velocityY.current * delta;

      // Ground collision
      if (pos.y <= GROUND_Y) {
        pos.y = GROUND_Y;
        velocityY.current = 0;
        isOnGround.current = true;
      }

      // Smooth rotation toward movement direction
      if (moving) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          facingAngle.current,
          0.12
        );
      }

      // Wing flap animation
      const flapSpeed = moving || !isOnGround.current ? 10 : 2;
      wingTime.current += delta * flapSpeed;
      const flapAngle = Math.sin(wingTime.current) * 0.5;

      if (leftWingRef.current) {
        leftWingRef.current.rotation.z = -(0.2 + flapAngle);
      }
      if (rightWingRef.current) {
        rightWingRef.current.rotation.z = 0.2 + flapAngle;
      }

      // Subtle body bob when moving
      if (bodyRef.current && moving) {
        bodyRef.current.position.y = Math.sin(wingTime.current * 0.5) * 0.04;
      }

      // Notify parent
      if (onPositionChange) {
        onPositionChange(pos.clone());
      }
    });

    return (
      <group ref={groupRef} position={[0, GROUND_Y, 0]}>
        {/* Body */}
        <mesh ref={bodyRef} position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.65, 0.55, 0.85]} />
          <meshLambertMaterial color="#1E90FF" />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.5, 0.12]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshLambertMaterial color="#1E90FF" />
        </mesh>

        {/* Head crest (top feather) */}
        <mesh position={[0, 0.82, 0.1]}>
          <boxGeometry args={[0.12, 0.2, 0.12]} />
          <meshLambertMaterial color="#1565C0" />
        </mesh>

        {/* Eye left */}
        <mesh position={[-0.2, 0.55, 0.36]}>
          <boxGeometry args={[0.1, 0.1, 0.02]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        {/* Eye left shine */}
        <mesh position={[-0.17, 0.58, 0.37]}>
          <boxGeometry args={[0.04, 0.04, 0.01]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>

        {/* Eye right */}
        <mesh position={[0.2, 0.55, 0.36]}>
          <boxGeometry args={[0.1, 0.1, 0.02]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        {/* Eye right shine */}
        <mesh position={[0.23, 0.58, 0.37]}>
          <boxGeometry args={[0.04, 0.04, 0.01]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>

        {/* Beak */}
        <mesh position={[0, 0.46, 0.42]}>
          <boxGeometry args={[0.18, 0.12, 0.18]} />
          <meshLambertMaterial color="#FFA500" />
        </mesh>

        {/* Left wing */}
        <mesh ref={leftWingRef} position={[-0.5, 0.05, 0]} castShadow>
          <boxGeometry args={[0.38, 0.14, 0.6]} />
          <meshLambertMaterial color="#1565C0" />
        </mesh>

        {/* Right wing */}
        <mesh ref={rightWingRef} position={[0.5, 0.05, 0]} castShadow>
          <boxGeometry args={[0.38, 0.14, 0.6]} />
          <meshLambertMaterial color="#1565C0" />
        </mesh>

        {/* Tail */}
        <mesh position={[0, -0.08, -0.55]}>
          <boxGeometry args={[0.35, 0.18, 0.28]} />
          <meshLambertMaterial color="#1565C0" />
        </mesh>

        {/* Tail tip */}
        <mesh position={[0, -0.12, -0.72]}>
          <boxGeometry args={[0.2, 0.1, 0.18]} />
          <meshLambertMaterial color="#0D47A1" />
        </mesh>

        {/* Left foot */}
        <mesh position={[-0.18, -0.32, 0.08]}>
          <boxGeometry args={[0.14, 0.1, 0.22]} />
          <meshLambertMaterial color="#FFA500" />
        </mesh>

        {/* Right foot */}
        <mesh position={[0.18, -0.32, 0.08]}>
          <boxGeometry args={[0.14, 0.1, 0.22]} />
          <meshLambertMaterial color="#FFA500" />
        </mesh>
      </group>
    );
  }
);

BlueBird.displayName = 'BlueBird';
export default BlueBird;

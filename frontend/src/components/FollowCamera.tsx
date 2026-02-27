import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BlueBirdHandle } from './BlueBird';

interface FollowCameraProps {
  target: React.RefObject<BlueBirdHandle | null>;
}

const OFFSET = new THREE.Vector3(0, 6, 11);
const LERP_FACTOR = 0.07;

export default function FollowCamera({ target }: FollowCameraProps) {
  const { camera } = useThree();
  const smoothPos = useRef(new THREE.Vector3(0, 6, 11));
  const smoothLook = useRef(new THREE.Vector3(0, 1, 0));
  const tempVec = new THREE.Vector3();

  useFrame(() => {
    if (!target.current) return;

    const birdPos = target.current.getPosition();

    // Desired camera position
    const desired = birdPos.clone().add(OFFSET);

    // Smooth lerp
    smoothPos.current.lerp(desired, LERP_FACTOR);
    camera.position.copy(smoothPos.current);

    // Look at bird (slightly above center)
    tempVec.copy(birdPos).add(new THREE.Vector3(0, 0.8, 0));
    smoothLook.current.lerp(tempVec, LERP_FACTOR);
    camera.lookAt(smoothLook.current);
  });

  return null;
}

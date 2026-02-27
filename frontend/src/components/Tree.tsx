interface TreeProps {
  position: [number, number, number];
  scale?: number;
}

export default function Tree({ position, scale = 1 }: TreeProps) {
  const trunkH = 3 * scale;
  const trunkW = 0.5 * scale;

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, trunkH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[trunkW, trunkH, trunkW]} />
        <meshLambertMaterial color="#5C3A1E" />
      </mesh>

      {/* Leaves - bottom layer (widest) */}
      <mesh position={[0, trunkH + 0.6 * scale, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6 * scale, 1.0 * scale, 2.6 * scale]} />
        <meshLambertMaterial color="#2D7A1F" />
      </mesh>

      {/* Leaves - middle layer */}
      <mesh position={[0, trunkH + 1.5 * scale, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0 * scale, 1.0 * scale, 2.0 * scale]} />
        <meshLambertMaterial color="#3A9E28" />
      </mesh>

      {/* Leaves - top layer (narrowest) */}
      <mesh position={[0, trunkH + 2.3 * scale, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2 * scale, 0.9 * scale, 1.2 * scale]} />
        <meshLambertMaterial color="#4BBF30" />
      </mesh>

      {/* Tip */}
      <mesh position={[0, trunkH + 3.0 * scale, 0]} castShadow>
        <boxGeometry args={[0.6 * scale, 0.6 * scale, 0.6 * scale]} />
        <meshLambertMaterial color="#5CD63A" />
      </mesh>
    </group>
  );
}

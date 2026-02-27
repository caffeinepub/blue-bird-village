import * as THREE from 'three';

function CloudBlock({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[6, 1.5, 3]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.92} />
      </mesh>
      <mesh position={[2, 0.75, 0]}>
        <boxGeometry args={[3, 1.5, 2.5]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.92} />
      </mesh>
      <mesh position={[-2, 0.5, 0]}>
        <boxGeometry args={[2.5, 1.2, 2]} />
        <meshBasicMaterial color="#F0F0F0" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

export default function Sky() {
  return (
    <group>
      {/* Sky dome */}
      <mesh>
        <sphereGeometry args={[90, 16, 16]} />
        <meshBasicMaterial color="#5BA3E0" side={THREE.BackSide} />
      </mesh>

      {/* Sun - blocky Minecraft style */}
      <group position={[35, 45, -55]}>
        <mesh>
          <boxGeometry args={[7, 7, 0.5]} />
          <meshBasicMaterial color="#FFE566" />
        </mesh>
        {/* Sun glow ring */}
        <mesh position={[0, 0, -0.3]}>
          <boxGeometry args={[9, 9, 0.1]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* Clouds */}
      <CloudBlock position={[-12, 26, -22]} />
      <CloudBlock position={[18, 30, -32]} />
      <CloudBlock position={[-28, 24, -18]} />
      <CloudBlock position={[8, 32, -42]} />
      <CloudBlock position={[25, 27, -10]} />
    </group>
  );
}

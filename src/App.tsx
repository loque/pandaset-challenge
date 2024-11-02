import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Cuboid({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} scale={1}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
}

export function App() {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Cuboid position={[-1.2, 0, 0]} />
      <Cuboid position={[1.2, 0, 0]} />
      <OrbitControls />
    </Canvas>
  );
}

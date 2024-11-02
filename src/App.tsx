import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLayoutEffect, useRef } from "react";
import { InstancedMesh, Object3D } from "three";

import data from "./frame_00.json";

interface Cuboid {
  uuid: string;
  label: string;
  yaw: number;
  stationary: boolean;
  camera_used: number;
  "position.x": number;
  "position.y": number;
  "position.z": number;
  "dimensions.x": number;
  "dimensions.y": number;
  "dimensions.z": number;
  "cuboids.sibling_id": string;
  "cuboids.sensor_id": number;
}

interface Data {
  cuboids: Cuboid[];
}

const typedData = data as Data;

const cuboids = typedData.cuboids;
console.debug(">>> data.cuboids", typedData.cuboids.length);

export function App() {
  const meshRef = useRef<InstancedMesh>();
  const tempObject = new Object3D();

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < cuboids.length; i++) {
      const c = cuboids[i];
      tempObject.position.set(
        c["position.x"],
        c["position.y"],
        c["position.z"]
      );
      tempObject.scale.set(
        c["dimensions.x"],
        c["dimensions.y"],
        c["dimensions.z"]
      );
      tempObject.rotation.set(0, 0, c.yaw);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <>
      <Canvas camera={{ position: [100, 100, 100], fov: 50 }}>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <OrbitControls />

        <instancedMesh ref={meshRef} args={[null, null, cuboids.length]}>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </instancedMesh>
      </Canvas>
    </>
  );
}

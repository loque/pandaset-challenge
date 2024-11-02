import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { InstancedMesh, Object3D, Vector3 } from "three";

const cuboids = [
  {
    uuid: "2c4dbdea-845e-4d29-8a94-9c86feb536fe",
    label: "Car",
    yaw: 2.3803062137948943,
    stationary: true,
    camera_used: 1,
    "position.x": 20.759,
    "position.y": 31.401,
    "position.z": 0.591,
    "dimensions.x": 1.867,
    "dimensions.y": 4.629,
    "dimensions.z": 1.673,
    "cuboids.sibling_id": "-",
    "cuboids.sensor_id": -1,
  },
  {
    uuid: "0633a338-f50d-41ca-a387-3100f81bb251",
    label: "Other Vehicle - Uncommon",
    yaw: -0.7840978931225617,
    stationary: true,
    camera_used: 3,
    "position.x": 4.823,
    "position.y": -26.158,
    "position.z": 0.729,
    "dimensions.x": 1.405,
    "dimensions.y": 2.943,
    "dimensions.z": 2,
    "cuboids.sibling_id": "-",
    "cuboids.sensor_id": -1,
  },
  {
    uuid: "fe0752c6-def9-4cd5-98a0-cccb49476e41",
    label: "Car",
    yaw: 2.3674233637175126,
    stationary: false,
    camera_used: 1,
    "position.x": 23.288,
    "position.y": 37.967,
    "position.z": 0.495,
    "dimensions.x": 1.806,
    "dimensions.y": 4.561,
    "dimensions.z": 1.512,
    "cuboids.sibling_id": "3d8dc08d-36e3-4d29-8998-c54f938209b6",
    "cuboids.sensor_id": 0,
  },
  {
    uuid: "3d8dc08d-36e3-4d29-8998-c54f938209b6",
    label: "Car",
    yaw: 2.3674233637175126,
    stationary: false,
    camera_used: 0,
    "position.x": 23.288,
    "position.y": 37.973,
    "position.z": 0.495,
    "dimensions.x": 1.806,
    "dimensions.y": 4.561,
    "dimensions.z": 1.512,
    "cuboids.sibling_id": "fe0752c6-def9-4cd5-98a0-cccb49476e41",
    "cuboids.sensor_id": 1,
  },
];

export function App() {
  const meshRef = useRef<InstancedMesh>();
  const tempObject = new Object3D();

  useEffect(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < cuboids.length; i++) {
      const c = cuboids[i];
      console.debug(">>> adding cuboid", c);
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
  }, [meshRef.current]);

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
      <OrbitControls />
      <instancedMesh ref={meshRef} args={[null, null, cuboids.length]}>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </instancedMesh>
    </Canvas>
  );
}

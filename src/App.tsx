import { Canvas, extend, Object3DNode } from "@react-three/fiber";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";

import { FrameControls } from "./FrameControls/FrameControls";
import { useDataFrame } from "./hooks/useDataFrame";
import { Cuboid } from "./types";

const MeshEdgesMaterial = shaderMaterial(
  {
    color: new THREE.Color("white"),
    size: new THREE.Vector3(1, 1, 1),
    thickness: 0.01,
    smoothness: 0.2,
  },
  /*glsl*/ `varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * viewMatrix * instanceMatrix * vec4(position, 1.0);
  }`,
  /*glsl*/ `varying vec3 vPosition;
  uniform vec3 size;
  uniform vec3 color;
  uniform float thickness;
  uniform float smoothness;
  void main() {
    vec3 d = abs(vPosition) - (size * 0.5);
    float a = smoothstep(thickness, thickness + smoothness, min(min(length(d.xy), length(d.yz)), length(d.xz)));
    gl_FragColor = vec4(color, 1.0 - a);
  }`
);

extend({ MeshEdgesMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshEdgesMaterial: Object3DNode<
        typeof MeshEdgesMaterial,
        typeof MeshEdgesMaterial
      >;
    }
  }
}

function Scene({ cuboids }: { cuboids: Cuboid[] }) {
  const solidMeshRef = useRef<THREE.InstancedMesh>();
  const wireframeMeshRef = useRef<THREE.InstancedMesh>();
  const tempObject = new THREE.Object3D();

  useLayoutEffect(() => {
    if (!solidMeshRef.current || !wireframeMeshRef.current || !cuboids) return;

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
      solidMeshRef.current.setMatrixAt(i, tempObject.matrix);
      wireframeMeshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    solidMeshRef.current.instanceMatrix.needsUpdate = true;
    wireframeMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [cuboids]);

  return (
    <group>
      <instancedMesh ref={solidMeshRef} args={[null, null, cuboids.length]}>
        <boxGeometry />
        <meshPhongMaterial color="orange" transparent opacity={0.2} />
      </instancedMesh>
      <instancedMesh ref={wireframeMeshRef} args={[null, null, cuboids.length]}>
        <boxGeometry />
        <meshEdgesMaterial
          transparent
          polygonOffset
          polygonOffsetFactor={-10}
          color="black"
          thickness={0.01}
          smoothness={0.005}
        />
      </instancedMesh>
    </group>
  );
}

export function App() {
  const { data, isLoading, currentFrame, goToPrevious, goToNext, goTo } =
    useDataFrame();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentFrame]);

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
        {data && <Scene cuboids={data.cuboids} />}
      </Canvas>
      <FrameControls
        currentFrame={currentFrame}
        isLoading={isLoading}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onFrameChange={goTo}
      />
    </>
  );
}

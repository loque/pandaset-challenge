import { useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, Object3DNode } from "@react-three/fiber";
import { Cuboid, Point } from "../types";

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

interface SceneProps {
  points: Point[];
  cuboids: Cuboid[];
}

const tmpCuboid = new THREE.Object3D();
const tmpPoint = new THREE.Object3D();

export function Scene({ points, cuboids }: SceneProps) {
  const pointsMeshRef = useRef<THREE.InstancedMesh>();
  const solidMeshRef = useRef<THREE.InstancedMesh>();
  const wireframeMeshRef = useRef<THREE.InstancedMesh>();

  useLayoutEffect(() => {
    if (
      !pointsMeshRef.current ||
      !solidMeshRef.current ||
      !wireframeMeshRef.current ||
      !cuboids ||
      !points
    )
      return;

    for (let i = 0; i < cuboids.length; i++) {
      const c = cuboids[i];
      tmpCuboid.position.set(c["position.x"], c["position.y"], c["position.z"]);
      tmpCuboid.scale.set(
        c["dimensions.x"],
        c["dimensions.y"],
        c["dimensions.z"]
      );
      tmpCuboid.rotation.set(0, 0, c.yaw);
      tmpCuboid.updateMatrix();
      solidMeshRef.current.setMatrixAt(i, tmpCuboid.matrix);
      wireframeMeshRef.current.setMatrixAt(i, tmpCuboid.matrix);
    }
    solidMeshRef.current.instanceMatrix.needsUpdate = true;
    wireframeMeshRef.current.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < points.length; i++) {
      tmpPoint.position.set(points[i][0], points[i][1], points[i][2]);
      tmpPoint.scale.set(0.1, 0.1, 0.1);
      tmpPoint.updateMatrix();
      pointsMeshRef.current.setMatrixAt(i, tmpPoint.matrix);
    }
    pointsMeshRef.current.instanceMatrix.needsUpdate = true;
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
      <instancedMesh ref={pointsMeshRef} args={[null, null, points.length]}>
        <boxGeometry />
        <meshStandardMaterial color="white" />
      </instancedMesh>
    </group>
  );
}

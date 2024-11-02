import { useRef, useLayoutEffect, useMemo, useCallback } from "react";
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
const tmpColor = new THREE.Color();

const colors = [
  new THREE.Color("white"),
  new THREE.Color("#e6ffe6"),
  new THREE.Color("#ccffcc"),
  new THREE.Color("#b3ffb3"),
  new THREE.Color("#99ff99"),
  new THREE.Color("#80ff80"),
  new THREE.Color("#66ff66"),
  new THREE.Color("#4dff4d"),
  new THREE.Color("#33ff33"),
  new THREE.Color("green"),
];

export function Scene({ points, cuboids }: SceneProps) {
  const pointsMeshRef = useRef<THREE.InstancedMesh>();
  const solidMeshRef = useRef<THREE.InstancedMesh>();
  const wireframeMeshRef = useRef<THREE.InstancedMesh>();

  const stats = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    points.forEach(([_x, _y, z]) => {
      if (z < min) min = z;
      if (z > max) max = z;
    });
    const range = Math.abs(max - min);
    return { min, max, range };
  }, [points]);

  const getColorIndex = useCallback(
    (z: number) => {
      const colorsCount = colors.length;
      const stepLen = stats.range / colorsCount;

      // Calculate the step index
      let colorIndex = Math.floor((z - stats.min) / stepLen);

      // Ensure stepIndex is within bounds
      if (colorIndex >= colorsCount) colorIndex = colorsCount - 1;

      return colorIndex;
    },
    [points, stats]
  );

  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(points.length)
          .fill(0)
          .flatMap((_, i) => tmpColor.set(colors[i]).toArray())
      ),
    [points]
  );

  useLayoutEffect(() => {
    if (!solidMeshRef.current || !wireframeMeshRef.current || !cuboids) return;

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
  }),
    [cuboids];

  useLayoutEffect(() => {
    if (!pointsMeshRef.current || !points) return;

    for (let i = 0; i < points.length; i++) {
      const [x, y, z] = points[i];
      tmpPoint.position.set(x, y, z);
      tmpPoint.scale.set(0.1, 0.1, 0.1);
      tmpPoint.updateMatrix();
      pointsMeshRef.current.setMatrixAt(i, tmpPoint.matrix);

      const colorIndex = getColorIndex(z);
      const color = colors[colorIndex];

      pointsMeshRef.current.setColorAt(i, color);
    }
    pointsMeshRef.current.instanceColor!.needsUpdate = true;
  }, [points]);

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
        <boxGeometry>
          <instancedBufferAttribute
            attach="attributes-color"
            args={[colorArray, 3]}
          />
        </boxGeometry>
        <meshBasicMaterial />
      </instancedMesh>
    </group>
  );
}

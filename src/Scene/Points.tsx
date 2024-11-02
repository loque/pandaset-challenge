import { useRef, useMemo, useCallback, useLayoutEffect } from "react";
import { Point } from "../types";
import * as THREE from "three";

const tmpPoint = new THREE.Object3D();

const colors = [
  new THREE.Color("#cccfff"),
  new THREE.Color("#b5baff"),
  new THREE.Color("#9fa5ff"),
  new THREE.Color("#8890ff"),
  new THREE.Color("#717bff"),
  new THREE.Color("#5b65ff"),
  new THREE.Color("#4450ff"),
  new THREE.Color("#2d3bff"),
  new THREE.Color("#1726ff"),
  new THREE.Color("#0011ff"),
];

interface PointsProps {
  points: Point[];
}
export function Points({ points }: PointsProps) {
  const pointsMeshRef = useRef<THREE.InstancedMesh>();

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

  useLayoutEffect(() => {
    if (!pointsMeshRef.current || !points) return;

    for (let i = 0; i < points.length; i++) {
      const [x, y, z] = points[i];
      tmpPoint.position.set(x, y, z);
      const size = 0.03;
      tmpPoint.scale.set(size, size, size);
      tmpPoint.updateMatrix();
      pointsMeshRef.current.setMatrixAt(i, tmpPoint.matrix);

      const colorIndex = getColorIndex(z);
      const color = colors[colorIndex];

      pointsMeshRef.current.setColorAt(i, color);
    }
    pointsMeshRef.current.instanceColor!.needsUpdate = true;
  }, [points]);

  return (
    <>
      <instancedMesh ref={pointsMeshRef} args={[null, null, points.length]}>
        <boxGeometry />
        <meshBasicMaterial />
      </instancedMesh>
    </>
  );
}

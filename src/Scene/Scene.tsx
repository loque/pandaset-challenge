import { useThree } from "@react-three/fiber";
import { Cuboid, Point } from "../types";
import { Cuboids } from "./Cuboids";
import { Points } from "./Points";
import { useRef, useEffect } from "react";
import * as THREE from "three";

const MOVEMENT_SPEED = 1;
const ROTATION_SPEED = 0.01;

interface SceneProps {
  points: Point[];
  cuboids: Cuboid[];
}

export function Scene({ points, cuboids }: SceneProps) {
  const { camera } = useThree();
  const requestId = useRef<number>();

  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key;
      if (keys.current.hasOwnProperty(key)) {
        keys.current[key as keyof typeof keys.current] = true;
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      const key = event.key;
      if (keys.current.hasOwnProperty(key)) {
        keys.current[key as keyof typeof keys.current] = false;
      }
    }

    function moveCamera() {
      const { w, a, s, d, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } =
        keys.current;

      const currentRotation = new THREE.Euler().copy(camera.rotation);

      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyEuler(new THREE.Euler(0, currentRotation.y, 0));

      const right = new THREE.Vector3();
      right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

      // Walk
      if (w) camera.position.add(forward.multiplyScalar(MOVEMENT_SPEED));
      if (s) camera.position.sub(forward.multiplyScalar(MOVEMENT_SPEED));
      if (d) camera.position.add(right.multiplyScalar(MOVEMENT_SPEED));
      if (a) camera.position.sub(right.multiplyScalar(MOVEMENT_SPEED));

      // Rotate
      if (ArrowLeft) camera.rotateY(ROTATION_SPEED);
      if (ArrowRight) camera.rotateY(-ROTATION_SPEED);
      if (ArrowUp) camera.rotateX(ROTATION_SPEED);
      if (ArrowDown) camera.rotateX(-ROTATION_SPEED);

      const euler = new THREE.Euler().setFromQuaternion(camera.quaternion);
      euler.x = Math.max(Math.min(euler.x, Math.PI / 2), -Math.PI / 2);
      camera.quaternion.setFromEuler(euler);

      requestId.current = requestAnimationFrame(moveCamera);
    }

    requestId.current = requestAnimationFrame(moveCamera);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (requestId.current) {
        cancelAnimationFrame(requestId.current);
      }
    };
  }, [camera]);

  return (
    <group position={[5, 0, 0]} rotation={[-1, 0, 0.8]}>
      <Cuboids cuboids={cuboids} />
      <Points points={points} />
    </group>
  );
}

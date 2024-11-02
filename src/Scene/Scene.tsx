import { Cuboid, Point } from "../types";
import { Cuboids } from "./Cuboids";
import { Points } from "./Points";

interface SceneProps {
  points: Point[];
  cuboids: Cuboid[];
}

export function Scene({ points, cuboids }: SceneProps) {
  return (
    <group>
      <Cuboids cuboids={cuboids} />
      <Points points={points} />
    </group>
  );
}

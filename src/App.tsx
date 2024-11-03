import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { FrameControls } from "./FrameControls/FrameControls";
import { useDataFrame } from "./hooks/useDataFrame";
import { Scene } from "./Scene/Scene";
import { Tooltip } from "./Tooltip/Tooltip";
import { useState } from "react";
import { Help } from "./Help/Help";

export function App() {
  const { data, isLoading, currentFrame, goToPrevious, goToNext, goTo } =
    useDataFrame();

  const [hoveredIdx, setHoveredIdx] = useState<number>();

  const tooltipContent =
    typeof hoveredIdx === "number" && data?.cuboids
      ? data.cuboids[hoveredIdx]
      : null;

  return (
    <>
      <Canvas>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <PerspectiveCamera makeDefault position={[0, 0, 80]} fov={45} />
        {data && (
          <Scene
            points={data.points}
            cuboids={data.cuboids}
            onCuboidHover={setHoveredIdx}
          />
        )}
      </Canvas>
      <FrameControls
        currentFrame={currentFrame}
        isLoading={isLoading}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onFrameChange={goTo}
      />
      <Tooltip content={tooltipContent} />
      <Help />
    </>
  );
}

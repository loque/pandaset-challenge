import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import { FrameControls } from "./FrameControls/FrameControls";
import { useDataFrame } from "./hooks/useDataFrame";
import { Scene } from "./Scene/Scene";

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
        {data && <Scene points={data.points} cuboids={data.cuboids} />}
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

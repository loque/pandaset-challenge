import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { FrameControls } from "./FrameControls/FrameControls";
import { useDataFrame } from "./hooks/useDataFrame";
import { Scene } from "./Scene/Scene";

export function App() {
  const { data, isLoading, currentFrame, goToPrevious, goToNext, goTo } =
    useDataFrame();

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

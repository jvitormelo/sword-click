import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

const Box = () => {
  const boxRef = useRef();

  useFrame(({ clock }) => {
    const box = boxRef.current!;
    box.position.y = -2 + Math.sin(clock.getElapsedTime()) * 2;
  });

  return (
    <mesh ref={boxRef}>
      <boxGeometry />
    </mesh>
  );
};

export const Example = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight color="red" position={[0, 0, 5]} />
      <mesh>
        <Box />
      </mesh>
    </Canvas>
  );
};

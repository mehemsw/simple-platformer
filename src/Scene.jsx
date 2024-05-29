import {
  OrbitControls,
  KeyboardControls,
  PerspectiveCamera,
} from "@react-three/drei";
import PhysicsScene from "./PhysicsScene";
import { useState } from "react";
import { Text3D } from "@react-three/drei";

const Scene = () => {
  // This is all for the non-implemented follow camera
  const [xpos, setXpos] = useState(0);
  const [ypos, setYpos] = useState(0);
  const [zpos, setZpos] = useState(0);

  const handleMoveCamera = (x, y, z) => {
    setXpos(x);
    setYpos(y);
    setZpos(z);
  };

  return (
    <>
      {/* Camera controls, max/min agles set to avoid moving the camera to weird places */}
      <OrbitControls
        target={[xpos, ypos, zpos]}
        maxDistance={10}
        maxPolarAngle={Math.PI / 4}
        minPolarAngle={-Math.PI / 2}
        maxAzimuthAngle={Math.PI / 4}
        minAzimuthAngle={-Math.PI / 4}
      />
      <ambientLight intensity={1.5} />
      <directionalLight position={[2, 2, 3]} castShadow />
      {/* Defining the keyboard controls here */}
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "KeyW"] },
          { name: "backward", keys: ["ArrowDown", "KeyS"] },
          { name: "left", keys: ["ArrowLeft", "KeyA"] },
          { name: "right", keys: ["ArrowRight", "KeyD"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <PhysicsScene moveCamera={handleMoveCamera} />
      </KeyboardControls>
    </>
  );
};

export default Scene;

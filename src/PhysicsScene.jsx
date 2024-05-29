import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, Text3D } from "@react-three/drei";
import * as THREE from "three";

const PhysicsScene = ({ moveCamera }) => {
  // Using state here to help with displaying the win message
  const [win, setWin] = useState(false);

  // Refs are used for interacting with the different meshes below
  const cubeRef = useRef();
  const spinner = useRef();
  const sideToSide = useRef();
  const isJump = useRef(false);

  // This is used to get ketboard controls working
  const allKeys = useKeyboardControls((keys) => keys);

  const handleCubeClick = () => {
    cubeRef.current.applyImpulse({ x: -5, y: 0, z: 0 });
  };

  // Function to handle moving the cube
  const handleCubeMovement = () => {
    if (allKeys.forward) {
      // Using the wakeUp function here makes it so the cube won't fall asleep and become unresponsive
      cubeRef.current.wakeUp();
      cubeRef.current.applyImpulse({ x: 0, y: 0, z: -0.3 });
    }
    if (allKeys.backward) {
      cubeRef.current.wakeUp();
      cubeRef.current.applyImpulse({ x: 0, y: 0, z: 0.3 });
    }
    if (allKeys.left) {
      cubeRef.current.wakeUp();
      cubeRef.current.applyImpulse({ x: -0.3, y: 0, z: 0 });
    }
    if (allKeys.right) {
      cubeRef.current.wakeUp();
      cubeRef.current.applyImpulse({ x: 0.3, y: 0, z: 0 });
    }
    if (isJump.current) {
      if (allKeys.jump) {
        cubeRef.current.wakeUp();
        cubeRef.current.applyImpulse({ x: 0, y: 40, z: 0 });
        isJump.current = false;
      }
    }
  };

  // This is to handle what happens when the cube falls off the platforms. It's not perfect
  const handleReset = () => {
    cubeRef.current.setTranslation({ x: 2, y: 2, z: 0 });
    cubeRef.current.setRotation({ x: 0, y: 0, z: 0 });
    cubeRef.current.setLinvel({ x: 0, y: 0, z: 0 });
    cubeRef.current.setAngvel({ x: 0, y: 0, z: 0 });
    setWin(false);
  };

  // useFrame is for getting things done every frame that is rendered
  useFrame((state) => {
    // The spinner and side-to-side mover are created here
    const getElapsedTime = state.clock.getElapsedTime();
    spinner.current.setNextKinematicTranslation({
      x: 0,
      y: Math.abs(Math.sin(getElapsedTime)),
      z: 0,
    });

    sideToSide.current.setNextKinematicTranslation({
      x: Math.sin(getElapsedTime / 2 + 1) * 7.5,
      y: Math.abs(Math.sin(getElapsedTime + 1)) + 0.35,
      z: -18,
    });

    // I don't really know what is going on here but it's needed for the rotation of the spinner. I got it from a tutorial
    const eulerRotationAngle = new THREE.Euler(0, getElapsedTime, 0);
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eulerRotationAngle);

    spinner.current.setNextKinematicRotation(quaternionRotation);

    handleCubeMovement();

    // This camera movement was an idea to have the camera follow the cube but I decided against it
    moveCamera(
      cubeRef.current.worldCom().x,
      cubeRef.current.worldCom().y,
      cubeRef.current.worldCom().z
    );
  });

  return (
    <>
      <Physics>
        {/* Cube created here */}
        <RigidBody
          ref={cubeRef}
          onCollisionEnter={() => (isJump.current = true)}
          onCollisionExit={() => (isJump.current = false)}
        >
          <mesh castShadow position={[0, 2.5, 4.5]} onClick={handleCubeClick}>
            <boxGeometry args={[1.75, 1.75, 1.75]} />
            <meshStandardMaterial color="#CC3941" />
          </mesh>
        </RigidBody>
        {/* Spinner */}
        <RigidBody
          ref={spinner}
          position={[0, -0.65, 0]}
          rotation={[0, Math.PI * 0.5, 0]}
          type="kinematicPosition"
        >
          <mesh receiveShadow>
            <boxGeometry args={[1, 0.35, 15]} />
            <meshStandardMaterial color="royalblue" />
          </mesh>
        </RigidBody>
        {/* Side-to-side mover */}
        <RigidBody
          ref={sideToSide}
          position={[0, 0.35, -18]}
          type="kinematicPosition"
        >
          <mesh receiveShadow>
            <boxGeometry args={[1, 0.35, 15]} />
            <meshStandardMaterial color="royalblue" />
          </mesh>
        </RigidBody>
        {/* First platform */}
        <RigidBody
          type="fixed"
          restitution={0.5}
          position={[0, -1, 0]}
          rotation={[Math.PI * 0.5, 0, 0]}
        >
          <mesh receiveShadow>
            <boxGeometry args={[15, 15, 0.35]} />
            <meshStandardMaterial color="#C7CAC7" />
          </mesh>
        </RigidBody>
        {/* Second platform */}
        <RigidBody
          type="fixed"
          restitution={0.5}
          position={[0, 0, -18]}
          rotation={[Math.PI * 0.5, 0, 0]}
        >
          <mesh receiveShadow>
            <boxGeometry args={[15, 15, 0.35]} />
            <meshStandardMaterial color="#C7CAC7" />
          </mesh>
        </RigidBody>
        {/* Winning platform */}
        <RigidBody
          type="fixed"
          restitution={0.5}
          position={[0, 1, -30]}
          rotation={[Math.PI * 0.5, 0, 0]}
        >
          <mesh receiveShadow>
            <boxGeometry args={[5, 5, 0.35]} />
            <meshStandardMaterial color="#C7CAC7" />
          </mesh>
        </RigidBody>
        {/* These's an invisible collider on top of the winning platform that detects when the cube enters it and then displays the win message */}
        <RigidBody type="fixed" position={[0, 2, -30]}>
          <CuboidCollider
            args={[2, 1, 2]}
            sensor
            onIntersectionEnter={() => setWin(true)}
          />
        </RigidBody>
        {/* I made a gigantic collider below the play area that resets the game when you fall off and enter it */}
        <RigidBody
          type="fixed"
          position={[0, -4, 0]}
          rotation={[Math.PI * 0.5, 0, 0]}
        >
          <CuboidCollider
            args={[100, 100, 0.35]}
            sensor
            onIntersectionEnter={handleReset}
            rotation={[0, 0, 0]}
          />
        </RigidBody>
      </Physics>
      {/* This is for displaying the win message */}
      {win && (
        <Text3D font="./fonts/1.json" position={[-5, 5, -30]} scale={2}>
          You Win!
          <meshNormalMaterial />
        </Text3D>
      )}
    </>
  );
};

export default PhysicsScene;

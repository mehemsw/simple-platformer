import ReactDOM from "react-dom/client";
import Scene from "./Scene.jsx";
import "./index.css";
import { Canvas } from "@react-three/fiber";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Canvas
    shadows
    camera={{ fov: 120, near: 0.1, far: 100, position: [0, 5, 10] }}
  >
    <Scene />
  </Canvas>
);

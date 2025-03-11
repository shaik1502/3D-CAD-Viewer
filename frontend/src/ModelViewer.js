import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";

const Model = ({ filename }) => {
  const extension = filename.split(".").pop().toLowerCase();
  const url = `http://localhost:5120/models/${filename}`;

  // Loaders must always be called at the top level
  const stlGeometry = useLoader(STLLoader, extension === "stl" ? url : null);
  const objModel = useLoader(OBJLoader, extension === "obj" ? url : null);

  let model;
  if (extension === "stl") {
    model = (
      <primitive
        object={
          new THREE.Mesh(
            stlGeometry,
            new THREE.MeshStandardMaterial({ color: "gray" })
          )
        }
      />
    );
  } else {
    model = <primitive object={objModel} />;
  }

  return <mesh>{model}</mesh>;
};

const ModelViewer = ({ filename, onBack }) => {
  return (
    <div className="full-screen">
      <button className="back-btn" onClick={() => onBack()}>⬅ Back</button>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <Suspense fallback={null}>
          <Model filename={filename} />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default ModelViewer;

import React, { useEffect, useRef } from "react";
import * as THREE from "three"; // 👈 IMPORTAMOS THREE
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Bounds } from "@react-three/drei";
import { Modal, Button } from "antd";

const Modelo3D = ({ url }) => {
  const { scene } = useGLTF(url);
  const { camera, invalidate } = useThree();
  const modelRef = useRef();

  useEffect(() => {
    if (modelRef.current) {
      // Ajustar la cámara para centrar el modelo
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / Math.sin(fov / 2)) * 1.5;

      camera.position.set(center.x, center.y, cameraZ);
      camera.lookAt(center);
      camera.updateProjectionMatrix();

      invalidate(); // Forzar renderizado
    }
  }, [scene, camera, invalidate]);

  return (
    <Bounds fit clip observe margin={1.2}>
      <primitive object={scene} ref={modelRef} />
    </Bounds>
  );
};

const VisorModelo3D = ({ url, onClose }) => {
  return (
    <Modal
      title="Visualización 3D"
      open={true}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Cerrar
        </Button>,
      ]}
      width={800}
      centered
    >
      <Canvas style={{ height: 500, width: "100%" }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />
        <Modelo3D url={url} />
      </Canvas>
    </Modal>
  );
};

export default VisorModelo3D;

import React, { Suspense, useState, useEffect, useMemo } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { OBJLoader, MTLLoader } from "three-stdlib";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const COLORS = {
  available: "#4ade80",
  occupied: "#ef4444",
  highlighted: "#FFD700",
};

const ParkingSpace = ({ space, position, size }) => (
  <group position={position}>
    <mesh receiveShadow castShadow>
      <boxGeometry args={[size, 0.5, size]} />
      <meshStandardMaterial color={COLORS[space.status]} />
    </mesh>
    {space.status === "occupied" && (
      <>
        <Text
          position={[0, size / 2, size / 3]}
          fontSize={size / 6}
          color="white"
        >
          {space.licensePlate}
        </Text>
        <Text
          position={[0, size / 4, size / 3]}
          fontSize={size / 4}
          color="white"
        >
          {space.id}
        </Text>
      </>
    )}
  </group>
);

const BuildingModel = ({ highlightedApartments, apartments }) => {
  // Cargar modelo del edificio
  const materials = useLoader(MTLLoader, "/models/edificio/building_04.mtl");
  materials.preload();
  const building = useLoader(
    OBJLoader,
    "/models/edificio/building_04.obj",
    (loader) => loader.setMaterials(materials)
  );

  // Solución para el error de customDepthMaterial
  const { scene } = useGLTF("/models/lampara/lampara.glb");
  const lampModel = useMemo(() => {
    const model = scene.clone();
    model.traverse((obj) => {
      if (obj.isMesh) {
        // Crear nuevo material sin propiedades problemáticas
        const newMaterial = new THREE.MeshStandardMaterial();
        Object.assign(newMaterial, obj.material);

        // Eliminar propiedades de solo lectura
        delete newMaterial.customDepthMaterial;
        delete newMaterial.customDistanceMaterial;

        obj.material = newMaterial;
        obj.customDepthMaterial = undefined;
      }
    });
    return model;
  }, [scene]);

  return (
    <group>
      <primitive object={building} scale={10} position={[50, 0, 0]} />
      {highlightedApartments.map((apt) => (
        <group key={`apt-${apt}`} position={apartments[apt].position}>
          <primitive
            object={lampModel}
            position={[-8.5, 2.3, -1]}
            scale={[-10, 2, 2]}
          />
          <Text position={[-2.5, 0, -1]} fontSize={1.5} color="black">
            {apt}
          </Text>
        </group>
      ))}
    </group>
  );
};

const ParkingLot = ({
  totalSpaces = 40,
  style,
  parkingSpaces = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    status: i % 4 === 0 ? "occupied" : "available",
    apartmentNumber: Math.ceil((i + 1) / 5),
    licensePlate: i % 4 === 0 ? `ABC-${1000 + i}` : undefined,
  })),
  apartments = Array.from({ length: 8 }, (_, i) => ({
    [i + 1]: {
      position: [50, 38 - i * 12, 37],
      parkingSpace: i * 5 + 1,
    },
  })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
  spaceSize = 10,
  spaceGap = 2,
}) => {
  const [highlighted, setHighlighted] = useState([]);

  const { rows, cols } = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(totalSpaces * 2));
    const rows = Math.ceil(totalSpaces / cols);
    return { rows, cols };
  }, [totalSpaces]);

  useEffect(() => {
    const occupied = Object.keys(apartments)
      .filter((apt) =>
        parkingSpaces.some(
          (s) =>
            s.id === apartments[apt].parkingSpace && s.status === "occupied"
        )
      )
      .map(Number);
    setHighlighted(occupied);
  }, [parkingSpaces, apartments]);

  const totalWidth = cols * (spaceSize + spaceGap) - spaceGap;
  const totalDepth = rows * (spaceSize + spaceGap) - spaceGap;
  const startX = -totalWidth / 2 + spaceSize / 2;
  const startZ = -totalDepth / 2 + spaceSize / 2;

  return (
    <div style={{ width: "100%", height: "100%", ...style }}>
      <Canvas shadows camera={{ position: [0, 50, 150], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 50, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <Suspense fallback={null}>
          <BuildingModel
            highlightedApartments={highlighted}
            apartments={apartments}
          />
        </Suspense>

        <group position={[0, 0, 0]}>
          {parkingSpaces.slice(0, totalSpaces).map((space) => {
            const row = Math.floor((space.id - 1) / cols);
            const col = (space.id - 1) % cols;
            return (
              <ParkingSpace
                key={space.id}
                space={space}
                position={[
                  startX + col * (spaceSize + spaceGap) - 30,
                  0,
                  startZ + row * (spaceSize + spaceGap),
                ]}
                size={spaceSize}
              />
            );
          })}
        </group>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={30}
          maxDistance={200}
        />
      </Canvas>
    </div>
  );
};

export default ParkingLot;

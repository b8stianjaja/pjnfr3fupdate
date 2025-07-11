// frontend/src/pages/CrystalPage/Furniture.jsx
import React from 'react';
import { RigidBody } from '@react-three/rapier';

// A simple material for all furniture pieces for a consistent look
const furnitureMaterial = <meshStandardMaterial color="#505050" roughness={0.6} metalness={0.1} />;

// Each piece of furniture is a fixed physics body so the player can collide with it.
// They all cast and receive shadows to ground them in the scene.

const Couch = () => (
  <group>
    {/* Base */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[0, 0.5, -4]}>
        <boxGeometry args={[4, 1, 1.5]} />
        {furnitureMaterial}
      </mesh>
    </RigidBody>
    {/* Backrest */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow position={[-0.2, 1.25, -4.6]}>
        <boxGeometry args={[4, 1.5, 0.3]} />
        {furnitureMaterial}
      </mesh>
    </RigidBody>
  </group>
);

const CoffeeTable = () => (
  <RigidBody type="fixed" colliders="cuboid">
    <mesh castShadow receiveShadow position={[0, 0.3, -1.5]}>
      <boxGeometry args={[2.5, 0.6, 1.2]} />
      {furnitureMaterial}
    </mesh>
  </RigidBody>
);

const Rug = () => (
  // The rug is a simple mesh without a physics body, so the player walks over it.
  <mesh receiveShadow position={[0, 0.11, -2.5]}>
    <boxGeometry args={[6, 0.02, 4]} />
    <meshStandardMaterial color="#4a3f3f" />
  </mesh>
);

const StandingLamp = () => (
  <group position={[3, 0, -5]}>
    {/* Base */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1.5, 16]} />
        {furnitureMaterial}
      </mesh>
    </RigidBody>
     {/* Shade */}
    <mesh castShadow position={[0, 1.6, 0]}>
      <cylinderGeometry args={[0.6, 0.8, 0.6, 16]} />
      <meshStandardMaterial color="#cccccc" emissive="white" emissiveIntensity={0} />
    </mesh>
  </group>
);

const ConsoleTable = () => (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[-5, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[5, 1, 1]} />
        {furnitureMaterial}
      </mesh>
    </RigidBody>
);


export function Furniture() {
  return (
    <group>
      <Couch />
      <CoffeeTable />
      <Rug />
      <StandingLamp />
      <ConsoleTable />
    </group>
  );
}   
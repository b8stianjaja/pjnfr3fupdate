import { RigidBody } from "@react-three/rapier";

export const Ground = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh receiveShadow position-y={-0.01} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#151515"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
    </RigidBody>
  );
};
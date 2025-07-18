import { RigidBody } from "@react-three/rapier";
import { Box } from "@react-three/drei";

export const Furniture = () => {
  return (
    <group>
      <RigidBody type="fixed" colliders="cuboid">
        <Box position={[5, 1, -2]} args={[2, 2, 2]}>
          <meshStandardMaterial color="maroon" />
        </Box>
        <Box position={[-4, 0.5, 4]} args={[3, 1, 2]}>
          <meshStandardMaterial color="teal" />
        </Box>
      </RigidBody>
    </group>
  );
};
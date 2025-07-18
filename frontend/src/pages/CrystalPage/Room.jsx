import React from 'react';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

export const Room = () => {
    // Make sure the path to your model is correct
    const { scene } = useGLTF('/path/to/your/room.gltf');
    return (
        <RigidBody type="fixed" colliders="trimesh">
            <primitive object={scene} />
        </RigidBody>
    );
};
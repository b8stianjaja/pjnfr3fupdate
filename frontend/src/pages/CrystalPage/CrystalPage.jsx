// frontend/src/pages/CrystalPage/CrystalPage.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { Player } from './Player';
import { Furniture } from './Furniture'; // Import the new Furniture component
import './CrystalPage.css';

const Ground = () => (
    <RigidBody type="fixed">
        <mesh receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[50, 0.2, 50]} />
            <meshStandardMaterial color="#202020" />
        </mesh>
    </RigidBody>
);

// New component to load the room model
const Room = () => {
    // Use the useGLTF hook to load your model
    const { scene } = useGLTF('/path/to/your/room.gltf');
    // You can add a RigidBody to the room to allow for collisions
    return (
        <RigidBody type="fixed" colliders="trimesh">
            <primitive object={scene} />
        </RigidBody>
    );
};

export default function CrystalPage() {
    return (
        <div className="crystal-page-container">
            <div className="crystal-canvas-container">
                <Canvas shadows camera={{ position: [-10, 9, 12], fov: 35 }}>
                    <color attach="background" args={['#101010']} />
                    <ambientLight intensity={0.1} />
                    <directionalLight
                        color="white"
                        position={[-15, 25, 15]}
                        intensity={1.0}
                        castShadow
                        shadow-mapSize-width={4096}
                        shadow-mapSize-height={4096}
                        shadow-camera-left={-20}
                        shadow-camera-right={20}
                        shadow-camera-top={20}
                        shadow-camera-bottom={-20}
                    />
                    <Suspense fallback={null}>
                        <Physics>
                            <Player />
                            <Ground />
                            <Furniture /> {/* Add the furniture to the scene */}
                            {/* Uncomment the line below to add your room to the scene */}
                            {/* <Room /> */}
                        </Physics>
                    </Suspense>
                    <OrbitControls
                        target={[0, 2, 0]}
                        enableZoom={false}
                        enablePan={false}
                        enableRotate={false}
                    />
                </Canvas>
            </div>
        </div>
    );
}
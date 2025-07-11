// frontend/src/pages/CrystalPage/Camera.jsx
import { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';

export const Camera = ({ playerRef }) => {
  const [isIntroDone, setIsIntroDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroDone(true);
    }, 500); // Delay before camera starts moving
    return () => clearTimeout(timer);
  }, []);

  useFrame((state) => {
    const player = playerRef.current;
    if (!player || !isIntroDone) return;

    // This is the final close-up position for the camera
    const targetPosition = new THREE.Vector3(2.5, 1.8, 2.5);
    
    const cameraTarget = new THREE.Vector3().copy(player.translation()).add(targetPosition);
    
    // Animate the camera to its target position
    gsap.to(state.camera.position, {
      x: cameraTarget.x,
      y: cameraTarget.y,
      z: cameraTarget.z,
      duration: 1.5,
      ease: 'power2.inOut',
    });

    // Make the camera always look at the player
    const lookAtTarget = new THREE.Vector3().copy(player.translation()).add(new THREE.Vector3(0, 1.5, 0));
    state.camera.lookAt(lookAtTarget);
  });

  return null;
};
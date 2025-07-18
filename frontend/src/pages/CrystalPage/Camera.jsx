import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// --- TWEAKABLE PARAMETERS ---
// Adjust these to change the camera's feel
const CAMERA_OFFSET = new THREE.Vector3(0, 1.8, 3.5); 
const LOOK_AT_OFFSET = new THREE.Vector3(0, 1.2, 0); 
const POSITION_SMOOTH_SPEED = 3.0;

export const Camera = ({ playerRef, characterRef }) => {
  const { camera } = useThree();
  const isInitialized = useRef(false);

  // Reusable vectors to avoid creating new ones every frame, for performance
  const targetPosition = new THREE.Vector3();
  const lookAtTarget = new THREE.Vector3();

  useFrame((state, delta) => {
    // Wait until the player and character are ready
    if (!playerRef.current || !characterRef.current) return;

    const playerPosition = playerRef.current.translation();
    const playerQuaternion = characterRef.current.quaternion;

    // 1. Calculate the camera's ideal position
    const desiredPosition = CAMERA_OFFSET.clone().applyQuaternion(playerQuaternion);
    targetPosition.copy(playerPosition).add(desiredPosition);

    // 2. Set initial position or smoothly move the camera
    if (!isInitialized.current) {
      // On the first frame, snap the camera instantly into place
      camera.position.copy(targetPosition);
      isInitialized.current = true;
    } else {
      // On all subsequent frames, move smoothly towards the target
      camera.position.lerp(targetPosition, delta * POSITION_SMOOTH_SPEED);
    }

    // 3. Always look at the character
    lookAtTarget.copy(playerPosition).add(LOOK_AT_OFFSET);
    camera.lookAt(lookAtTarget);
  });

  return null;
};
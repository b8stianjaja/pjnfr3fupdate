// frontend/src/pages/CrystalPage/Player.jsx
import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useInput } from './useInput';

export function Player() {
  const playerRef = useRef();
  const characterRef = useRef();
  const { input, handleGamepad } = useInput();
  const { scene, animations } = useGLTF('/character.glb');
  const { actions } = useAnimations(animations, characterRef);

  useEffect(() => {
    actions['Idle']?.play();
    scene.traverse((child) => {
      if (child.isMesh) child.castShadow = true;
    });
  }, [actions, scene]);

  useFrame((state, delta) => {
    handleGamepad(); // Poll controller input every frame

    const player = playerRef.current;
    if (!player) return; // Guard clause to prevent errors

    const { forward, backward, left, right, action } = input.current;

    // --- Tank Controls ---
    const rotationSpeed = 4 * delta;
    const moveSpeed = 5 * delta;

    if (left) characterRef.current.rotation.y += rotationSpeed;
    if (right) characterRef.current.rotation.y -= rotationSpeed;

    const moveDirection = new THREE.Vector3();
    if (forward) moveDirection.z = -1;
    if (backward) moveDirection.z = 1;

    // Apply the character's rotation to the movement direction
    moveDirection.applyQuaternion(characterRef.current.quaternion);
    moveDirection.multiplyScalar(moveSpeed);

    // Apply movement to the physics body
    const currentPos = player.translation();
    player.setNextKinematicTranslation({
      x: currentPos.x + moveDirection.x,
      y: currentPos.y,
      z: currentPos.z + moveDirection.z,
    });

    // --- Animation ---
    const isMoving = forward || backward;
    if (isMoving) {
      actions['Walk']?.reset().fadeIn(0.2).play();
      actions['Idle']?.fadeOut(0.2);
    } else {
      actions['Walk']?.fadeOut(0.2);
      actions['Idle']?.reset().fadeIn(0.2).play();
    }
  });

  return (
    <RigidBody ref={playerRef} type="kinematicPosition" colliders={false} mass={1} position={[0, 0, 0]}>
      <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.3, 0]} />
      <group ref={characterRef} position={[0, 0.6, 0]}>
        <primitive object={scene} scale={1.2} />
      </group>
    </RigidBody>
  );
}
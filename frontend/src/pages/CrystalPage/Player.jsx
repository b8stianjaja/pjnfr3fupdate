import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useInput } from './useInput';

// --- TWEAKABLE PARAMETERS ---
const MOVE_SPEED = 3;
const ROTATION_SPEED = 4;
const ANIMATION_SPEED_FACTOR = 0.8;
const SMOOTH_TIME = 0.1;

export const Player = forwardRef(({ characterRef }, ref) => {
  const characterScale = 14;
  const playerRef = ref;
  const { input } = useInput();
  const { scene, animations } = useGLTF('/character0.glb');
  const { actions } = useAnimations(animations, characterRef);
  const [currentAnimation, setCurrentAnimation] = useState('Idle');
  
  const velocity = useRef(new THREE.Vector3());
  const rotationSpeed = useRef(0);

  useEffect(() => {
    const walkAction = actions['Walk'];
    const walkBackAction = actions['WalkBack'];
    if (walkAction) walkAction.timeScale = ANIMATION_SPEED_FACTOR;
    if (walkBackAction) walkBackAction.timeScale = ANIMATION_SPEED_FACTOR;
    
    actions['Idle']?.play();

    const glowColor = new THREE.Color('white');
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        const oldMaterial = child.material;
        const newMaterial = new THREE.MeshStandardMaterial({
          color: glowColor,
          emissive: glowColor,
          emissiveIntensity: 2.5,
          map: oldMaterial.map,
          roughness: 0.4,
          metalness: 0.1,
        });
        child.material = newMaterial;
        oldMaterial.dispose();
      }
    });
  }, [actions, scene]);

  useFrame((state, delta) => {
    const player = playerRef.current;
    if (!player) return;

    const { forward, backward, left, right } = input.current;

    // --- Smoothed Tank Controls Logic ---
    let targetRotationSpeed = 0;
    if (left) targetRotationSpeed += ROTATION_SPEED;
    if (right) targetRotationSpeed -= ROTATION_SPEED;

    rotationSpeed.current = THREE.MathUtils.lerp(rotationSpeed.current, targetRotationSpeed, delta / SMOOTH_TIME);
    characterRef.current.rotation.y += rotationSpeed.current * delta;

    const moveDirection = new THREE.Vector3();
    if (forward) moveDirection.z = -1;
    if (backward) moveDirection.z = 1;
    moveDirection.applyQuaternion(characterRef.current.quaternion);
    
    const targetVelocity = moveDirection.multiplyScalar(MOVE_SPEED);
    velocity.current.lerp(targetVelocity, delta / SMOOTH_TIME);

    const currentPos = player.translation();
    player.setNextKinematicTranslation({
      x: currentPos.x + velocity.current.x * delta,
      y: currentPos.y,
      z: currentPos.z + velocity.current.z * delta,
    });
    
    // --- Animation Control ---
    const isMoving = forward || backward;
    let nextAnimation = 'Idle';
    if (isMoving) {
        nextAnimation = forward ? 'Walk' : 'WalkBack';
    }

    if (nextAnimation !== currentAnimation) {
      const oldAction = actions[currentAnimation];
      const newAction = actions[nextAnimation];
      oldAction?.fadeOut(0.2);
      newAction?.reset().fadeIn(0.2).play();
      setCurrentAnimation(nextAnimation);
    }
  });

  return (
    <RigidBody ref={playerRef} type="kinematicPosition" colliders={false} mass={1} position={[0, 0, 0]}>
      <CapsuleCollider 
        args={[0.6 * characterScale, 10 * characterScale]} 
        position={[0, 0.7 * characterScale, 0]} 
      />
      {/* Outer group for turning, controlled by A/D keys */}
      <group ref={characterRef} position={[0, 0, 0]}>
        {/* Inner group for a one-time rotational correction of the model */}
        <group rotation={[0, Math.PI / 2, 0]}>
          <primitive object={scene} scale={characterScale} />
        </group>
      </group>
    </RigidBody>
  );
});
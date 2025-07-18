import React, { Suspense, useRef } from 'react';
import { Select } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Physics } from '@react-three/rapier';
import { Player } from './Player';
import { Furniture } from './Furniture';
import { Ground } from './Ground';
import { Camera } from './Camera';

export function Experience() {
  const playerRef = useRef();
  const characterRef = useRef();

  return (
    <>
      <Camera playerRef={playerRef} characterRef={characterRef} />
      
      <ambientLight intensity={0.1} />
      <directionalLight
        color="white"
        position={[-15, 25, 15]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      <Suspense fallback={null}>
        <Physics>
          <Select>
            <Player ref={playerRef} characterRef={characterRef} />
          </Select>
          <Ground />
          <Furniture />
        </Physics>
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={2.0}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.2}
          height={400}
          selection
        />
      </EffectComposer>
    </>
  );
}
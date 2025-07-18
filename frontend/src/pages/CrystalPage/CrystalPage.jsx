import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './Experience';
import './CrystalPage.css';

export default function CrystalPage() {
  return (
    <div className="crystal-page-container">
      <div className="crystal-canvas-container">
        <Canvas shadows>
          <color attach="background" args={['#101010']} />
          <Experience />
        </Canvas>
      </div>
    </div>
  );
}
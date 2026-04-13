'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, PerspectiveCamera, SpotLight } from '@react-three/drei';
import { IgnatiusModel } from '@/features/3d-model/components/ignatius-model';
import React, { Suspense, useEffect } from 'react';
import gsap from 'gsap';

interface IgnatiusSceneProps {
  progress: number;
}

function RingLight() {
  return (
    // Position behind the model (negative Z), centered on torso/head area
    <mesh position={[0, 0.05, -0.8]} rotation={[0, 0, 0]}>
      <torusGeometry
        args={[
          0.95, // radius — how big the ring is
          0.05, // tube thickness — keep thin like the reference
          36, // radial segments
          128, // tubular segments — higher = smoother circle
        ]}
      />
      <meshStandardMaterial
        color='#ffffff'
        emissive='#ffffff'
        emissiveIntensity={0.5} // the glow intensity
        toneMapped={false} // critical — allows bloom to blow out properly
      />
    </mesh>
  );
}

export default function IgnatiusScene({ progress }: IgnatiusSceneProps) {
  const cameraRef = React.useRef<any>(null);

  useFrame(() => {
    cameraRef.current.lookAt(0, 0, 0);
  });

  useEffect(() => {
    const updateCameraPosition = () => {
      // Update camera position based on progress
      const positions = [
        [0, 0, 4.77],
        [2, 2, 2.5],
        [-2, 2, 3],
      ];

      const segmentProgress = 1 / 2;

      const segmentIndex = Math.floor(progress / segmentProgress);

      // Prevent out of bounds access
      if (segmentIndex >= positions.length - 1) {
        return;
      }

      const percentage = (progress % segmentProgress) / segmentProgress;

      const [startX, startY, startZ] = positions[segmentIndex];
      const [endX, endY, endZ] = positions[segmentIndex + 1];

      const x = startX + (endX - startX) * percentage;
      const y = startY + (endY - startY) * percentage;
      const z = startZ + (endZ - startZ) * percentage;

      gsap.to(cameraRef.current.position, {
        x,
        y,
        z,
        duration: 5,
        ease: 'power1.out',
      });
    };

    updateCameraPosition();
  }, [progress, cameraRef.current]);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={32} far={1000} near={0.1} position={[0, 0, 4.7]} />

      {/* Dark ambient — model should be mostly shadowed */}
      <ambientLight intensity={0.05} color='#0a0c10' />

      {/* The ring light itself illuminates the scene */}
      {/* Position matches the RingLight mesh so it feels like the ring is the source */}
      {/* <pointLight
                position={[0, 0.3, -0.5]}
                intensity={0}
                distance={10}
                color="#ffffff"
            /> */}

      {/* Subtle cool key from upper right — fills the face */}
      <directionalLight position={[0.5, 1, 0.4]} intensity={5} color='#b0bac8' />

      {/* Rim light from behind left — separates model from background */}
      <directionalLight position={[-3, 1, -3]} intensity={0.6} color='#8090b0' />

      <RingLight />

      <group position={[0, -1.5, 0]} scale={1.5}>
        <IgnatiusModel />
      </group>

      <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={4} blur={2.5} color='#000000' />
    </>
  );
}

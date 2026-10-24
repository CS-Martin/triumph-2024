'use client';

import { useFrame } from '@react-three/fiber';
import { ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { IgnatiusModel } from '@/features/3d-model/components/ignatius-model';
import React from 'react';
import * as THREE from 'three';

interface IgnatiusSceneProps {
  progress: React.RefObject<number>;
}

const CAMERA_POSITIONS: [number, number, number][] = [
  [0, 0, 4.77],
  [2, 2, 2.5],
  [-2, 2, 3],
];

const SEGMENT_PROGRESS = 1 / 2;
const CAMERA_DAMPING = 2;

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
        emissiveIntensity={1.5} // the glow intensity — must exceed the bloom luminance threshold
        toneMapped={false} // critical — allows bloom to blow out properly
      />
    </mesh>
  );
}

export default function IgnatiusScene({ progress }: IgnatiusSceneProps) {
  const cameraRef = React.useRef<THREE.PerspectiveCamera>(null);
  const target = React.useRef(new THREE.Vector3(...CAMERA_POSITIONS[0]));

  useFrame((_, delta) => {
    const camera = cameraRef.current;
    if (!camera) return;

    // Interpolate between camera waypoints based on scroll progress
    const segmentIndex = Math.floor(progress.current / SEGMENT_PROGRESS);

    // Prevent out of bounds access — hold the last target once past the final waypoint
    if (segmentIndex < CAMERA_POSITIONS.length - 1) {
      const percentage = (progress.current % SEGMENT_PROGRESS) / SEGMENT_PROGRESS;
      const [startX, startY, startZ] = CAMERA_POSITIONS[segmentIndex];
      const [endX, endY, endZ] = CAMERA_POSITIONS[segmentIndex + 1];

      target.current.set(
        startX + (endX - startX) * percentage,
        startY + (endY - startY) * percentage,
        startZ + (endZ - startZ) * percentage,
      );
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.current.x, CAMERA_DAMPING, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target.current.y, CAMERA_DAMPING, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target.current.z, CAMERA_DAMPING, delta);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={32} far={1000} near={0.1} position={[0, 0, 4.7]} />

      {/* Dark ambient — model should be mostly shadowed */}
      <ambientLight intensity={0.05} color='#0a0c10' />

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

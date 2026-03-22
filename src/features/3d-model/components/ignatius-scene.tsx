"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, PerspectiveCamera, SpotLight } from "@react-three/drei";
import { Model } from "@/features/3d-model/components/ignatius-model";
import React, { Suspense, useEffect } from "react";
import gsap from "gsap";

interface IgnatiusSceneProps {
    progress: number;
}

export default function IgnatiusScene({ progress }: IgnatiusSceneProps) {
    const cameraRef = React.useRef<any>(null);

    useFrame(() => {
        cameraRef.current.lookAt(0, 0, 0);
    })

    useEffect(() => {
        const updateCameraPosition = () => {
            // Update camera position based on progress
            const positions = [
                [0, 0, 4.77],
                [3, 2, 2.5],
                [-3, 2, 3],
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
                duration: .1,
                ease: "power2.out"
            });
        }

        updateCameraPosition();
    }, [progress, cameraRef.current])

    return (
        <>
            <PerspectiveCamera
                ref={cameraRef}
                makeDefault
                fov={32}
                far={1000}
                near={0.1}
                position={[0, 0, 4.7]}
            />
            {/* <OrbitControls /> */}
            <axesHelper args={[500]} />
            <Environment preset="city" />


            <ambientLight intensity={20} color="#a09b9b" />


            <group position={[0, -1.5, 0]} scale={1.3}>
                <Model />
            </group>


            <ContactShadows
                position={[0, -2.5, 0]}
                opacity={0.5}
                scale={4}
                blur={2.5}
                color="#000000"
            />
        </>
    );
}
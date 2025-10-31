"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { TriumphModel } from "@/features/3d-model/components/triumph-model";
import React, { Suspense, useEffect } from "react";

export default function TriumphScene() {
    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Canvas
                className="w-full h-full"
                camera={{ position: [0, 5, -105], fov: 50 }}
                orthographic
                gl={{ antialias: true, alpha: true }}
                shadows
            >
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
}

function Scene() {
    // OrbitControls will manage the camera automatically based on target

    return (
        <group>
            {/* Ambient light so objects are visible even without direct light */}
            <ambientLight intensity={0.3} />

            {/* Directional light to provide some general illumination */}
            <directionalLight
                position={[5, 5, 5]}
                intensity={0.3}
                castShadow={false}
            />

            <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={8}
                maxDistance={25}
                target={[0, -10, -120]}
                enableDamping={true}
                dampingFactor={0.05}
            />

            {/* Environment for additional ambient lighting */}
            <Environment preset="night" />

            <group position={[0, -15, -120]}>
                <TriumphModel />
            </group>

            <ContactShadows
                opacity={0.4}
                position={[0, -15.5, -120]}
                scale={12}
                blur={2.5}
                far={6}
                color="#000000"
            />
        </group>
    );
}
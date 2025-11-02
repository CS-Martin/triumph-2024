"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { TriumphModel } from "@/features/3d-model/components/triumph-model";
import React, { Suspense, useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import GoBackButton from "./ui/go-back-button";

interface TriumphModelAxesProps {

    axes: {
        x: number;
        y: number;
        depth: number;
    }
}

export default function TriumphScene({ axes }: TriumphModelAxesProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const [isFocused, setIsFocused] = useState(false);
    const resetFocusRef = useRef<(() => void) | null>(null);

    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Canvas
                className="w-full h-full"
                camera={{ fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                shadows
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={() => {
                    setIsHovered(false);
                    setMousePosition({ x: 0.5, y: 0.5 });
                }}
                onPointerMove={(e) => {
                    if (isHovered) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = (e.clientX - rect.left) / rect.width;
                        const y = (e.clientY - rect.top) / rect.height;
                        setMousePosition({ x, y });
                    }
                }}
            >
                <Suspense fallback={null}>
                    <Scene
                        isHovered={isHovered}
                        mousePosition={mousePosition}
                        axes={axes}
                        setIsFocused={setIsFocused}
                        resetFocusRef={resetFocusRef}
                    />
                </Suspense>
            </Canvas>
            <GoBackButton
                isVisible={isFocused}
                onClose={() => {
                    if (resetFocusRef.current) {
                        resetFocusRef.current();
                        setIsFocused(false);
                    }
                }}
            />
        </div>
    );
}

function Scene({
    isHovered,
    mousePosition,
    axes,
    setIsFocused: setParentIsFocused,
    resetFocusRef
}: {
    isHovered: boolean;
    mousePosition: { x: number; y: number };
    axes: { x: number; y: number; depth: number };
    setIsFocused: (value: boolean) => void;
    resetFocusRef: React.MutableRefObject<(() => void) | null>;
}) {
    const { camera } = useThree();
    const [focusedObjectPosition, setFocusedObjectPosition] = useState<THREE.Vector3 | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const focusTarget = useRef<THREE.Vector3 | null>(null);
    const focusCameraPosition = useRef<THREE.Vector3 | null>(null);
    const focusAnimation = useRef<gsap.core.Tween | null>(null);

    const target = new THREE.Vector3(0, -8.5, -120);
    const defaultPosition = new THREE.Vector3(-10, 0, 0);

    // Calculate the default position relative to target in spherical coordinates
    const defaultOffset = defaultPosition.clone().sub(target);
    const defaultRadius = defaultOffset.length();
    const defaultPolar = Math.acos(defaultOffset.y / defaultRadius);
    const defaultAzimuth = Math.atan2(defaultOffset.z, defaultOffset.x);

    // Limited orbital movement ranges (±8 degrees for very subtle movement)
    const azimuthRange = Math.PI / 10;
    const polarRange = Math.PI / 10;
    // Zoom in by reducing the radius
    const radius = defaultRadius * 0.25;

    // Recalculate default position with zoom
    const zoomedDefaultOffset = defaultOffset.normalize().multiplyScalar(radius);
    const zoomedDefaultPosition = target.clone().add(zoomedDefaultOffset);

    // Starting position (farther away for zoom-in animation)
    const startOffset = defaultOffset.normalize().multiplyScalar(defaultRadius * 0.6); // Start at 60% of original distance
    const startPosition = target.clone().add(startOffset);

    // Animation state
    const animationProgress = useRef(0);
    const animationDuration = 2000; // 2 seconds
    const animationStartTime = useRef<number | null>(null);
    const modelLoaded = useRef(false);
    const loadDelay = useRef(500); // Wait 500ms after model loads before starting animation

    const targetPosition = useRef(zoomedDefaultPosition.clone());
    const currentPosition = useRef(startPosition.clone());

    // Function to focus on an object
    const focusOnObject = (worldPosition: THREE.Vector3) => {
        setIsFocused(true);
        setParentIsFocused(true);
        setFocusedObjectPosition(worldPosition.clone());
        focusTarget.current = worldPosition.clone();

        // Calculate camera position relative to the object (closer and at an angle)
        // Position camera at a comfortable distance from the object
        const offset = new THREE.Vector3(-0.3, 0.2, 1).normalize().multiplyScalar(15.5);
        focusCameraPosition.current = worldPosition.clone().add(offset);

        // Animate camera to focus position
        if (focusAnimation.current) {
            focusAnimation.current.kill();
        }

        const startPos = camera.position.clone();
        focusAnimation.current = gsap.to({ x: startPos.x, y: startPos.y, z: startPos.z }, {
            x: focusCameraPosition.current!.x,
            y: focusCameraPosition.current!.y,
            z: focusCameraPosition.current!.z,
            duration: 1.2,
            ease: "power2.inOut",
            onUpdate: function () {
                camera.position.set(this.targets()[0].x, this.targets()[0].y, this.targets()[0].z);
            }
        });
    };

    const resetFocus = () => {
        if (focusAnimation.current) {
            focusAnimation.current.kill();
        }

        // First, zoom out smoothly while still looking at the object
        const startPos = camera.position.clone();
        const currentTarget = focusTarget.current || startPos;

        // Calculate a zoomed-out position in the same direction as current view
        const currentDirection = startPos.clone().sub(currentTarget).normalize();
        const zoomedOutDistance = 30; // Zoom out to a comfortable distance
        const intermediateZoomPos = currentTarget.clone().add(
            currentDirection.multiplyScalar(zoomedOutDistance)
        );

        // Animate zoom out first, then pan to default view
        focusAnimation.current = gsap.to({ x: startPos.x, y: startPos.y, z: startPos.z }, {
            x: intermediateZoomPos.x,
            y: intermediateZoomPos.y,
            z: intermediateZoomPos.z,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: function () {
                camera.position.set(this.targets()[0].x, this.targets()[0].y, this.targets()[0].z);
                // Continue looking at the object while zooming out
                if (focusTarget.current) {
                    camera.lookAt(focusTarget.current);
                }
            },
            onComplete: () => {
                // After zooming out, smoothly transition to default view
                const midPos = camera.position.clone();
                gsap.to({ x: midPos.x, y: midPos.y, z: midPos.z }, {
                    x: zoomedDefaultPosition.x,
                    y: zoomedDefaultPosition.y,
                    z: zoomedDefaultPosition.z,
                    duration: 1.0,
                    ease: "power2.inOut",
                    onUpdate: function () {
                        camera.position.set(this.targets()[0].x, this.targets()[0].y, this.targets()[0].z);
                        camera.lookAt(target);
                    },
                    onComplete: () => {
                        // Clear focus state after animation completes
                        setIsFocused(false);
                        setParentIsFocused(false);
                        setFocusedObjectPosition(null);
                        focusTarget.current = null;
                    }
                });
            }
        });
    };

    // Expose resetFocus to parent component
    useEffect(() => {
        resetFocusRef.current = resetFocus;
    }, [resetFocusRef, resetFocus]);

    // Mark model as loaded after a brief delay to ensure it's fully rendered
    useEffect(() => {
        const timer = setTimeout(() => {
            modelLoaded.current = true;
        }, loadDelay.current);

        return () => clearTimeout(timer);
    }, []);

    useFrame((state, delta) => {
        // Wait for model to load before starting animation
        if (!modelLoaded.current) {
            camera.position.copy(startPosition);
            camera.lookAt(target);
            return;
        }

        // If focused on an object, always look at it
        if (isFocused && focusTarget.current) {
            camera.lookAt(focusTarget.current);
            return;
        }

        // Handle initial zoom-in animation
        if (animationStartTime.current === null) {
            animationStartTime.current = state.clock.elapsedTime * 1000; // Convert to milliseconds
        }

        const elapsed = (state.clock.elapsedTime * 1000) - animationStartTime.current!;

        if (animationProgress.current < 1) {
            // Ease-out animation (smooth deceleration)
            const progress = Math.min(elapsed / animationDuration, 1);
            animationProgress.current = 1 - Math.pow(1 - progress, 3); // Cubic ease-out

            // Interpolate from start position to zoomed default position
            currentPosition.current.lerpVectors(startPosition, zoomedDefaultPosition, animationProgress.current);
        } else {
            // Animation complete, handle hover movement
            if (isHovered) {
                // Convert mouse position (0-1) to orbital angles with limits
                const azimuth = defaultAzimuth + (mousePosition.x - 0.5) * 2 * azimuthRange;
                const polar = defaultPolar + (mousePosition.y - 0.5) * 2 * polarRange;

                // Clamp polar angle to avoid flipping
                const minPolar = 0.1;
                const maxPolar = Math.PI - 0.1;
                const clampedPolar = Math.max(minPolar, Math.min(maxPolar, polar));

                // Calculate target camera position in spherical coordinates
                targetPosition.current.set(
                    target.x + radius * Math.sin(clampedPolar) * Math.cos(azimuth),
                    target.y + radius * Math.cos(clampedPolar),
                    target.z + radius * Math.sin(clampedPolar) * Math.sin(azimuth)
                );
            } else {
                // Smoothly return to default position when not hovered
                targetPosition.current.copy(zoomedDefaultPosition);
            }

            // Smooth interpolation to target position (slower for gentler movement)
            currentPosition.current.lerp(targetPosition.current, 0.003);
        }

        camera.position.copy(currentPosition.current);
        camera.lookAt(target);
    });

    return (
        <group>
            {/* Ambient light so objects are visible even without direct light */}
            <ambientLight intensity={0.3} color="white" />

            {/* Environment for additional ambient lighting */}
            <Environment preset="night" />

            {/* [x, y, z] */}
            <group position={[axes.x, axes.y, axes.depth]}>
                <TriumphModel
                    focusOnObject={focusOnObject}
                    resetFocus={resetFocus}
                    isFocused={isFocused}
                />
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


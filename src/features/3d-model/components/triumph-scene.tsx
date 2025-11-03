"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { TriumphModel } from "@/features/3d-model/components/triumph-model";
import React, { Suspense, useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import GoBackButton from "./ui/go-back-button";
import ObjectTitle from "./ui/object-title";
import ObjectActionButton from "./ui/object-action-button";
import { useCameraStore } from "../stores/camera-store";

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
    const isFocused = useCameraStore((state) => state.isFocused);
    const resetFocus = useCameraStore((state) => state.resetFocus);

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
                    />
                </Suspense>
            </Canvas>
            <GoBackButton
                isVisible={isFocused}
                onClose={resetFocus}
            />
            <ObjectTitle />
            <ObjectActionButton />
        </div>
    );
}

function Scene({
    isHovered,
    mousePosition,
    axes
}: {
    isHovered: boolean;
    mousePosition: { x: number; y: number };
    axes: { x: number; y: number; depth: number };
}) {
    const { camera } = useThree();
    const isFocused = useCameraStore((state) => state.isFocused);
    const isResetting = useCameraStore((state) => state.isResetting);
    const focusTarget = useCameraStore((state) => state.focusTarget);
    const focusCameraPosition = useCameraStore((state) => state.focusCameraPosition);
    const clearFocusState = useCameraStore((state) => state.clearFocusState);
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

    // Handle focus changes from store
    useEffect(() => {
        if (isFocused && focusTarget && focusCameraPosition) {
            // Clear reset animation flag when new focus starts
            isResettingAnimation.current = false;

            // Animate camera to focus position
            if (focusAnimation.current) {
                focusAnimation.current.kill();
            }

            const startPos = camera.position.clone();
            focusAnimation.current = gsap.to({ x: startPos.x, y: startPos.y, z: startPos.z }, {
                x: focusCameraPosition.x,
                y: focusCameraPosition.y,
                z: focusCameraPosition.z,
                duration: 1.2,
                ease: "power2.inOut",
                onUpdate: function () {
                    camera.position.set(this.targets()[0].x, this.targets()[0].y, this.targets()[0].z);
                }
            });
        }
    }, [isFocused, focusTarget, focusCameraPosition, camera]);

    // Track if reset animation is in progress - use ref to avoid state dependency issues
    const isResettingAnimation = useRef(false);
    const savedResetTarget = useRef<THREE.Vector3 | null>(null);
    const prevIsResetting = useRef(false);

    // Save focus target when focused
    useEffect(() => {
        if (isFocused && focusTarget) {
            savedResetTarget.current = focusTarget.clone();
        }
    }, [isFocused, focusTarget]);

    // Handle reset focus - detect when reset is triggered via Zustand, but execute independently
    useEffect(() => {
        // Detect reset trigger: isResetting changed from false to true
        const resetJustTriggered = !prevIsResetting.current && isResetting;

        if (resetJustTriggered && !isResettingAnimation.current) {
            // Reset was triggered, animate zoom out
            isResettingAnimation.current = true;

            if (focusAnimation.current) {
                focusAnimation.current.kill();
            }

            // Use saved target (saved when focused)
            const currentFocusTarget = savedResetTarget.current;
            if (!currentFocusTarget) {
                // If no target, just clear state immediately
                isResettingAnimation.current = false;
                clearFocusState();
                prevIsResetting.current = isResetting;
                return;
            }

            const startPos = camera.position.clone();

            // Calculate a zoomed-out position in the same direction as current view
            const currentDirection = startPos.clone().sub(currentFocusTarget).normalize();
            const zoomedOutDistance = 30; // Zoom out to a comfortable distance
            const intermediateZoomPos = currentFocusTarget.clone().add(
                currentDirection.multiplyScalar(zoomedOutDistance)
            );

            // Animate zoom out first, then pan to default view
            focusAnimation.current = gsap.to({ x: startPos.x, y: startPos.y, z: startPos.z }, {
                x: intermediateZoomPos.x,
                y: intermediateZoomPos.y,
                z: intermediateZoomPos.z,
                duration: 0.5,
                ease: "power2.out",
                onUpdate: function () {
                    camera.position.set(this.targets()[0].x, this.targets()[0].y, this.targets()[0].z);

                    // Continue looking at the object while zooming out
                    camera.lookAt(currentFocusTarget);
                },
                onComplete: () => {
                    // After zooming out, smoothly transition to default view
                    const midPos = camera.position.clone();
                    gsap.to({ x: midPos.x, y: midPos.y, z: midPos.z }, {
                        x: zoomedDefaultPosition.x,
                        y: zoomedDefaultPosition.y,
                        z: zoomedDefaultPosition.z,
                        duration: 1,
                        ease: "power2.inOut",
                        onUpdate: function () {
                            const posX = this.targets()[0].x;
                            const posY = this.targets()[0].y;
                            const posZ = this.targets()[0].z;

                            camera.position.set(posX, posY, posZ);
                            camera.lookAt(target);

                            // Continuously sync currentPosition during animation to prevent mismatch
                            currentPosition.current.set(posX, posY, posZ);
                            targetPosition.current.set(posX, posY, posZ);
                        },
                        onComplete: () => {
                            // Ensure camera is exactly at the target position to prevent stutter
                            camera.position.copy(zoomedDefaultPosition);
                            camera.lookAt(target);

                            // Final sync to ensure exact match
                            currentPosition.current.copy(zoomedDefaultPosition);
                            targetPosition.current.copy(zoomedDefaultPosition);

                            // Clear focus state after animation completes
                            clearFocusState();

                            // Clear saved target since we no longer need it
                            savedResetTarget.current = null;

                            // Don't clear isResettingAnimation here - keep it true to prevent stutter
                            // It will be cleared automatically when a new focus starts
                            // This prevents useFrame from taking control and causing position conflicts
                        }
                    });
                }
            });
        }

        prevIsResetting.current = isResetting;
    }, [isResetting, zoomedDefaultPosition, target, camera, clearFocusState]);

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

        // If resetting, let GSAP animation control camera position - don't interfere
        // Only update lookAt, GSAP handles position updates
        if (isResettingAnimation.current) {
            // If no saved target and not focused, reset animation is complete
            // Allow normal operation to resume
            if (!savedResetTarget.current && !focusTarget) {
                isResettingAnimation.current = false;
            } else {
                // Use saved target if available, otherwise use focusTarget
                const lookAtTarget = savedResetTarget.current || focusTarget;
                if (lookAtTarget) {
                    camera.lookAt(lookAtTarget);
                }
                return;
            }
        }

        // If focused on an object, always look at it
        if (isFocused && focusTarget) {
            camera.lookAt(focusTarget);
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


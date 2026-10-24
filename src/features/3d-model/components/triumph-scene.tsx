"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { TriumphModel } from "@/features/3d-model/components/triumph-model";
import React, { Suspense, useRef, useEffect } from "react";
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

const TARGET = new THREE.Vector3(0, -8.5, -120);
const DEFAULT_POSITION = new THREE.Vector3(-10, 0, 0);

// Calculate the default position relative to target in spherical coordinates
const DEFAULT_OFFSET = DEFAULT_POSITION.clone().sub(TARGET);
const DEFAULT_RADIUS = DEFAULT_OFFSET.length();
const DEFAULT_POLAR = Math.acos(DEFAULT_OFFSET.y / DEFAULT_RADIUS);
const DEFAULT_AZIMUTH = Math.atan2(DEFAULT_OFFSET.z, DEFAULT_OFFSET.x);

// Limited orbital movement ranges (±8 degrees for very subtle movement)
const AZIMUTH_RANGE = Math.PI / 10;
const POLAR_RANGE = Math.PI / 10;
// Zoom in by reducing the radius
const RADIUS = DEFAULT_RADIUS * 0.25;

const DEFAULT_DIRECTION = DEFAULT_OFFSET.clone().normalize();

// Default position with zoom
const ZOOMED_DEFAULT_POSITION = TARGET.clone().add(DEFAULT_DIRECTION.clone().multiplyScalar(RADIUS));

// Starting position (farther away for zoom-in animation) - 60% of original distance
const START_POSITION = TARGET.clone().add(DEFAULT_DIRECTION.clone().multiplyScalar(DEFAULT_RADIUS * 0.6));

const ANIMATION_DURATION = 2000; // 2 seconds
const LOAD_DELAY = 500; // Wait 500ms after model loads before starting animation

export default function TriumphScene({ axes }: TriumphModelAxesProps) {
    // Pointer state lives in refs so moving the mouse never re-renders the canvas tree
    const isHovered = useRef(false);
    const mousePosition = useRef({ x: 0.5, y: 0.5 });
    const isFocused = useCameraStore((state) => state.isFocused);
    const resetFocus = useCameraStore((state) => state.resetFocus);

    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Canvas
                className="w-full h-full"
                camera={{ position: [20, 0, 0], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                shadows
                onPointerEnter={() => {
                    isHovered.current = true;
                }}
                onPointerLeave={() => {
                    isHovered.current = false;
                    mousePosition.current = { x: 0.5, y: 0.5 };
                }}
                onPointerMove={(e) => {
                    if (isHovered.current) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        mousePosition.current = {
                            x: (e.clientX - rect.left) / rect.width,
                            y: (e.clientY - rect.top) / rect.height,
                        };
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
    isHovered: React.RefObject<boolean>;
    mousePosition: React.RefObject<{ x: number; y: number }>;
    axes: { x: number; y: number; depth: number };
}) {
    const { camera } = useThree();
    const isFocused = useCameraStore((state) => state.isFocused);
    const isResetting = useCameraStore((state) => state.isResetting);
    const focusTarget = useCameraStore((state) => state.focusTarget);
    const focusCameraPosition = useCameraStore((state) => state.focusCameraPosition);
    const clearFocusState = useCameraStore((state) => state.clearFocusState);
    const focusAnimation = useRef<gsap.core.Tween | null>(null);

    // Animation state
    const animationProgress = useRef(0);
    const animationStartTime = useRef<number | null>(null);
    const modelLoaded = useRef(false);

    const targetPosition = useRef(ZOOMED_DEFAULT_POSITION.clone());
    const currentPosition = useRef(START_POSITION.clone());

    // Track if reset animation is in progress - use ref to avoid state dependency issues
    const isResettingAnimation = useRef(false);
    const savedResetTarget = useRef<THREE.Vector3 | null>(null);
    const prevIsResetting = useRef(false);

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
                    focusAnimation.current = gsap.to({ x: midPos.x, y: midPos.y, z: midPos.z }, {
                        x: ZOOMED_DEFAULT_POSITION.x,
                        y: ZOOMED_DEFAULT_POSITION.y,
                        z: ZOOMED_DEFAULT_POSITION.z,
                        duration: 1,
                        ease: "power2.inOut",
                        onUpdate: function () {
                            const posX = this.targets()[0].x;
                            const posY = this.targets()[0].y;
                            const posZ = this.targets()[0].z;

                            camera.position.set(posX, posY, posZ);
                            camera.lookAt(TARGET);

                            // Continuously sync currentPosition during animation to prevent mismatch
                            currentPosition.current.set(posX, posY, posZ);
                            targetPosition.current.set(posX, posY, posZ);
                        },
                        onComplete: () => {
                            // Ensure camera is exactly at the target position to prevent stutter
                            camera.position.copy(ZOOMED_DEFAULT_POSITION);
                            camera.lookAt(TARGET);

                            // Final sync to ensure exact match
                            currentPosition.current.copy(ZOOMED_DEFAULT_POSITION);
                            targetPosition.current.copy(ZOOMED_DEFAULT_POSITION);

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
    }, [isResetting, camera, clearFocusState]);

    // Kill any running camera tween on unmount
    useEffect(() => {
        return () => {
            focusAnimation.current?.kill();
        };
    }, []);

    // Mark model as loaded after a brief delay to ensure it's fully rendered
    useEffect(() => {
        const timer = setTimeout(() => {
            modelLoaded.current = true;
        }, LOAD_DELAY);

        return () => clearTimeout(timer);
    }, []);

    useFrame((state) => {
        // Wait for model to load before starting animation
        if (!modelLoaded.current) {
            camera.position.copy(START_POSITION);
            camera.lookAt(TARGET);
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

        const elapsed = (state.clock.elapsedTime * 1000) - animationStartTime.current;

        if (animationProgress.current < 1) {
            // Ease-out animation (smooth deceleration)
            const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
            animationProgress.current = 1 - Math.pow(1 - progress, 3); // Cubic ease-out

            // Interpolate from start position to zoomed default position
            currentPosition.current.lerpVectors(START_POSITION, ZOOMED_DEFAULT_POSITION, animationProgress.current);
        } else {
            // Animation complete, handle hover movement
            if (isHovered.current) {
                // Convert mouse position (0-1) to orbital angles with limits
                const azimuth = DEFAULT_AZIMUTH + (mousePosition.current.x - 0.5) * 2 * AZIMUTH_RANGE;
                const polar = DEFAULT_POLAR + (mousePosition.current.y - 0.5) * 2 * POLAR_RANGE;

                // Clamp polar angle to avoid flipping
                const minPolar = 0.1;
                const maxPolar = Math.PI - 0.1;
                const clampedPolar = Math.max(minPolar, Math.min(maxPolar, polar));

                // Calculate target camera position in spherical coordinates
                targetPosition.current.set(
                    TARGET.x + RADIUS * Math.sin(clampedPolar) * Math.cos(azimuth),
                    TARGET.y + RADIUS * Math.cos(clampedPolar),
                    TARGET.z + RADIUS * Math.sin(clampedPolar) * Math.sin(azimuth)
                );
            } else {
                // Smoothly return to default position when not hovered
                targetPosition.current.copy(ZOOMED_DEFAULT_POSITION);
            }

            // Smooth interpolation to target position (slower for gentler movement)
            currentPosition.current.lerp(targetPosition.current, 0.003);
        }

        camera.position.copy(currentPosition.current);
        camera.lookAt(TARGET);
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

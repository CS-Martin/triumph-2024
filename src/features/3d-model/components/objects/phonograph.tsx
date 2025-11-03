import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { gsap } from "gsap"
import { useFrame } from "@react-three/fiber"
import { useCameraStore } from "../../stores/camera-store"

type PhonographProps = {
    nodes: {
        Phonograph_low: THREE.Mesh
    }
    materials: {
        Phonograph: THREE.MeshStandardMaterial
    }
}
export default function Phonograph({ nodes, materials }: PhonographProps) {
    const focusOnObject = useCameraStore((state) => state.focusOnObject)
    const setHoveredObject = useCameraStore((state) => state.setHoveredObject)
    const isFocused = useCameraStore((state) => state.isFocused && state.focusedObjectId === 'phonograph')
    const phonographRef = useRef<THREE.Mesh>(null)
    const [isHovered, setIsHovered] = useState(false)
    const scaleAnimation = useRef<gsap.core.Tween | null>(null)
    const floatingOffset = useRef(0)
    const baseLocalY = useRef<number>(0)
    const hasStoredBasePosition = useRef(false)

    // Store base local Y position when focused
    useEffect(() => {
        if (phonographRef.current) {
            if (isFocused && !hasStoredBasePosition.current) {
                baseLocalY.current = phonographRef.current.position.y
                hasStoredBasePosition.current = true
            } else if (!isFocused) {
                hasStoredBasePosition.current = false
                // Reset position when unfocused
                if (phonographRef.current) {
                    phonographRef.current.position.y = baseLocalY.current
                }
            }
        }
    }, [isFocused])

    // Floating animation when focused
    useFrame((state) => {
        if (!phonographRef.current || !isFocused) return

        // Floating animation
        floatingOffset.current += state.clock.getDelta() * 2
        const floatAmount = Math.sin(floatingOffset.current) * 0.08

        // Set position relative to base Y position
        phonographRef.current.position.y = baseLocalY.current + floatAmount
    })

    useEffect(() => {
        if (!phonographRef.current) return

        // Kill any existing animation
        if (scaleAnimation.current) {
            scaleAnimation.current.kill()
        }

        // Keep hovered state when focused
        const shouldScaleUp = isHovered || isFocused

        if (shouldScaleUp) {
            // Scale up on hover or when focused
            scaleAnimation.current = gsap.to(phonographRef.current.scale, {
                x: 1.15,
                y: 1.15,
                z: 1.15,
                duration: 0.3,
                ease: "power2.out"
            })
        } else {
            // Scale back to normal
            scaleAnimation.current = gsap.to(phonographRef.current.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.3,
                ease: "power2.out"
            })
        }
    }, [isHovered, isFocused])
    return (
        <mesh
            ref={phonographRef}
            name="Phonograph_low"
            castShadow
            receiveShadow
            geometry={nodes.Phonograph_low.geometry}
            material={materials.Phonograph}
            onPointerOver={(e) => {
                e.stopPropagation()
                setIsHovered(true)
                setHoveredObject('phonograph')
                document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
                e.stopPropagation()
                setIsHovered(false)
                setHoveredObject(null)
                document.body.style.cursor = 'auto'
            }}
            onClick={(e) => {
                e.stopPropagation()

                if (phonographRef.current && focusOnObject) {
                    // Calculate bounding box in world space for accurate object center
                    phonographRef.current.updateMatrixWorld(true) // Ensure matrix is updated
                    const box = new THREE.Box3().setFromObject(phonographRef.current)
                    const center = new THREE.Vector3()
                    box.getCenter(center) // This already gives world coordinates

                    // Focus camera on the object center
                    focusOnObject('phonograph', center)

                    // Keep hover state when focused
                    setIsHovered(true)
                }
            }}
        >

        </mesh>
    )
}
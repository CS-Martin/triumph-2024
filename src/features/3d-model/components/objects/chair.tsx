import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { gsap } from "gsap"
import { useFrame } from "@react-three/fiber"

type ChairProps = {
    nodes: {
        Chair_low: THREE.Mesh
    }
    materials: {
        Chair: THREE.MeshStandardMaterial
    }
    focusOnObject?: (position: THREE.Vector3) => void
    resetFocus?: () => void
    isFocused?: boolean
}

export default function Chair({ nodes, materials, focusOnObject, resetFocus, isFocused }: ChairProps) {
    const chairRef = useRef<THREE.Mesh>(null)
    const [isHovered, setIsHovered] = useState(false)
    const scaleAnimation = useRef<gsap.core.Tween | null>(null)
    const floatingOffset = useRef(0)
    const baseLocalY = useRef<number>(0)
    const hasStoredBasePosition = useRef(false)

    // Store base local Y position when focused
    useEffect(() => {
        if (chairRef.current) {
            if (isFocused && !hasStoredBasePosition.current) {
                baseLocalY.current = chairRef.current.position.y
                hasStoredBasePosition.current = true
            } else if (!isFocused) {
                hasStoredBasePosition.current = false
                // Reset position when unfocused
                if (chairRef.current) {
                    chairRef.current.position.y = baseLocalY.current
                }
            }
        }
    }, [isFocused])

    // Floating animation when focused
    useFrame((state) => {
        if (!chairRef.current || !isFocused) return

        // Floating animation
        floatingOffset.current += state.clock.getDelta() * 2
        const floatAmount = Math.sin(floatingOffset.current) * 0.08

        // Set position relative to base Y position
        chairRef.current.position.y = baseLocalY.current + floatAmount
    })

    useEffect(() => {
        if (!chairRef.current) return

        // Kill any existing animation
        if (scaleAnimation.current) {
            scaleAnimation.current.kill()
        }

        // Keep hovered state when focused
        const shouldScaleUp = isHovered || isFocused

        if (shouldScaleUp) {
            // Scale up on hover or when focused
            scaleAnimation.current = gsap.to(chairRef.current.scale, {
                x: 1.15,
                y: 1.15,
                z: 1.15,
                duration: 0.3,
                ease: "power2.out"
            })
        } else {
            // Scale back to normal
            scaleAnimation.current = gsap.to(chairRef.current.scale, {
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
            ref={chairRef}
            name="Chair_low"
            castShadow
            receiveShadow
            geometry={nodes.Chair_low.geometry}
            material={materials.Chair}
            onPointerOver={(e) => {
                e.stopPropagation()
                setIsHovered(true)
                document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
                e.stopPropagation()
                setIsHovered(false)
                document.body.style.cursor = 'auto'
            }}
            onClick={(e) => {
                e.stopPropagation()

                if (chairRef.current && focusOnObject) {
                    // Calculate bounding box in world space for accurate object center
                    chairRef.current.updateMatrixWorld(true) // Ensure matrix is updated
                    const box = new THREE.Box3().setFromObject(chairRef.current)
                    const center = new THREE.Vector3()
                    box.getCenter(center) // This already gives world coordinates

                    // Focus camera on the object center
                    focusOnObject(center)

                    // Keep hover state when focused
                    setIsHovered(true)
                }
            }}
        >

        </mesh>
    )
}


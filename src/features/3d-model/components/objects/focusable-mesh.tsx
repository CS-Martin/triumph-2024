import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { gsap } from "gsap"
import { useFrame } from "@react-three/fiber"
import { useCameraStore } from "../../stores/camera-store"

type FocusableMeshProps = {
    objectId: string
    name: string
    geometry: THREE.BufferGeometry
    material: THREE.Material
}

export default function FocusableMesh({ objectId, name, geometry, material }: FocusableMeshProps) {
    const focusOnObject = useCameraStore((state) => state.focusOnObject)
    const setHoveredObject = useCameraStore((state) => state.setHoveredObject)
    const isFocused = useCameraStore((state) => state.isFocused && state.focusedObjectId === objectId)
    const meshRef = useRef<THREE.Mesh>(null)
    const [isHovered, setIsHovered] = useState(false)
    const scaleAnimation = useRef<gsap.core.Tween | null>(null)
    const floatingOffset = useRef(0)
    const baseLocalY = useRef<number>(0)
    const hasStoredBasePosition = useRef(false)

    // Store base local Y position when focused
    useEffect(() => {
        const mesh = meshRef.current
        if (!mesh) return

        if (isFocused && !hasStoredBasePosition.current) {
            baseLocalY.current = mesh.position.y
            hasStoredBasePosition.current = true
        } else if (!isFocused) {
            hasStoredBasePosition.current = false
            // Reset position when unfocused
            mesh.position.y = baseLocalY.current
        }
    }, [isFocused])

    // Floating animation when focused
    useFrame((_, delta) => {
        if (!meshRef.current || !isFocused) return

        floatingOffset.current += delta * 2
        const floatAmount = Math.sin(floatingOffset.current) * 0.08

        // Set position relative to base Y position
        meshRef.current.position.y = baseLocalY.current + floatAmount
    })

    useEffect(() => {
        const mesh = meshRef.current
        if (!mesh) return

        scaleAnimation.current?.kill()

        // Keep scaled up while hovered or focused
        const scale = isHovered || isFocused ? 1.15 : 1

        scaleAnimation.current = gsap.to(mesh.scale, {
            x: scale,
            y: scale,
            z: scale,
            duration: 0.3,
            ease: "power2.out"
        })

        return () => {
            scaleAnimation.current?.kill()
        }
    }, [isHovered, isFocused])

    return (
        <mesh
            ref={meshRef}
            name={name}
            castShadow
            receiveShadow
            geometry={geometry}
            material={material}
            onPointerOver={(e) => {
                e.stopPropagation()
                setIsHovered(true)
                setHoveredObject(objectId)
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

                if (meshRef.current) {
                    // Calculate bounding box in world space for accurate object center
                    meshRef.current.updateMatrixWorld(true)
                    const box = new THREE.Box3().setFromObject(meshRef.current)
                    const center = new THREE.Vector3()
                    box.getCenter(center)

                    // Focus camera on the object center
                    focusOnObject(objectId, center)

                    // Keep hover state when focused
                    setIsHovered(true)
                }
            }}
        />
    )
}

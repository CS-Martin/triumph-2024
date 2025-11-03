import { create } from 'zustand'
import * as THREE from 'three'

type CameraState = {
    isFocused: boolean
    isResetting: boolean
    focusedObjectId: string | null
    hoveredObjectId: string | null
    focusedObjectPosition: THREE.Vector3 | null
    focusTarget: THREE.Vector3 | null
    focusCameraPosition: THREE.Vector3 | null
    setFocusState: (objectId: string | null, position: THREE.Vector3 | null, target: THREE.Vector3 | null, cameraPos: THREE.Vector3 | null) => void
    focusOnObject: (objectId: string, position: THREE.Vector3) => void
    setHoveredObject: (objectId: string | null) => void
    resetFocus: () => void
    clearFocusState: () => void
}

export const useCameraStore = create<CameraState>((set) => ({
    isFocused: false,
    isResetting: false,
    focusedObjectId: null,
    hoveredObjectId: null,
    focusedObjectPosition: null,
    focusTarget: null,
    focusCameraPosition: null,
    setFocusState: (objectId, position, target, cameraPos) =>
        set({
            isFocused: objectId !== null,
            isResetting: false,
            focusedObjectId: objectId,
            focusedObjectPosition: position,
            focusTarget: target,
            focusCameraPosition: cameraPos,
        }),
    focusOnObject: (objectId, position) => {
        // Calculate camera position relative to the object
        const offset = new THREE.Vector3(-0.3, 0.2, 1).normalize().multiplyScalar(15.5)
        const cameraPos = position.clone().add(offset)
        
        set({
            isFocused: true,
            isResetting: false,
            focusedObjectId: objectId,
            focusedObjectPosition: position.clone(),
            focusTarget: position.clone(),
            focusCameraPosition: cameraPos,
        })
    },
    setHoveredObject: (objectId) =>
        set({
            hoveredObjectId: objectId,
        }),
    resetFocus: () =>
        set({
            isResetting: true,
            // Keep focusTarget temporarily for animation
        }),
    clearFocusState: () =>
        set({
            isFocused: false,
            isResetting: false,
            focusedObjectId: null,
            hoveredObjectId: null,
            focusedObjectPosition: null,
            focusTarget: null,
            focusCameraPosition: null,
        }),
}))


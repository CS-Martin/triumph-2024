import React from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GLTF } from 'three-stdlib'
import type { ThreeElements } from '@react-three/fiber'

type IgnatiusModelProps = GLTF & {
    nodes: { StIgnatius1_low: THREE.Mesh }
    materials: { Default: THREE.MeshStandardMaterial }
}

export function IgnatiusModel(props?: ThreeElements['group']) {
    const gltfData = useGLTF('/model/ignatius-model.glb') as unknown as IgnatiusModelProps
    const { nodes, materials } = gltfData

    return (
        <group {...props} dispose={null}>
            <mesh
                name="StIgnatius1_low"
                castShadow
                receiveShadow
                geometry={nodes.StIgnatius1_low.geometry}
                material={materials.Default}
            />
        </group>
    )
}

useGLTF.preload('/model/ignatius-model.glb')

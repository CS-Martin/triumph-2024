import * as THREE from "three"
import FocusableMesh from "./focusable-mesh"

type ChairProps = {
    nodes: {
        Chair_low: THREE.Mesh
    }
    materials: {
        Chair: THREE.MeshStandardMaterial
    }
}

export default function Chair({ nodes, materials }: ChairProps) {
    return (
        <FocusableMesh
            objectId="chair"
            name="Chair_low"
            geometry={nodes.Chair_low.geometry}
            material={materials.Chair}
        />
    )
}

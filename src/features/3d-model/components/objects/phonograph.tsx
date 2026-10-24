import * as THREE from "three"
import FocusableMesh from "./focusable-mesh"

type PhonographProps = {
    nodes: {
        Phonograph_low: THREE.Mesh
    }
    materials: {
        Phonograph: THREE.MeshStandardMaterial
    }
}
export default function Phonograph({ nodes, materials }: PhonographProps) {
    return (
        <FocusableMesh
            objectId="phonograph"
            name="Phonograph_low"
            geometry={nodes.Phonograph_low.geometry}
            material={materials.Phonograph}
        />
    )
}

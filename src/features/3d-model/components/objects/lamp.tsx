import * as THREE from "three"

type LampProps = {
    nodes: {
        Lamp_low: THREE.Mesh
    }
    materials: {
        Lamp: THREE.MeshStandardMaterial
    }
}
export default function Lamp({ nodes, materials }: LampProps) {
    return (
        <mesh
            name="Lamp_low"
            castShadow
            receiveShadow
            geometry={nodes.Lamp_low.geometry}
            material={materials.Lamp}
        >   <group>
                {/* Left lamp */}
                {/* Lamp lights */}
                <pointLight castShadow position={[-22, 24, -2]} intensity={800} color="orange" />

                {/* Lamp shadows */}
                <pointLight castShadow position={[-14, 28, -8]} intensity={800} color="orange" />

                {/* Lamp light sources */}
                <pointLight distance={100} position={[-24, 24.5, -8]} intensity={200} color="#DADB5B" />
                <pointLight distance={100} position={[-24, 24.5, -8]} intensity={300} color="red" />



                {/* Right lamp */}
                {/* Lamp lights */}
                <pointLight castShadow position={[19, 24.5, -2]} intensity={800} color="orange" />

                {/* Lamp shadows */}
                <pointLight castShadow position={[14, 28, -8]} intensity={800} color="orange" />

                {/* Lamp light sources */}
                <pointLight distance={100} position={[24, 24.5, -8]} intensity={200} color="#DADB5B" />
                <pointLight distance={100} position={[24, 24.5, -8]} intensity={300} color="red" />

                <pointLight castShadow position={[0, 30, 15]} intensity={100} color="orange" />
            </group>
        </mesh>
    )
}
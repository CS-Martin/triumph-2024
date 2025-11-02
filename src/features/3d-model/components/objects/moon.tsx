export default function Moon() {
    return (
        <>
            {/* Sun outside the window - positioned in model space */}
            <group position={[-40, 15, -70]}>
                {/* Sun light source */}
                <pointLight
                    castShadow
                    position={[15, 0, 5]}
                    intensity={8000}
                    color="white"
                    distance={200}
                    decay={1.9}
                />

                {/* Visible sun circle with glowing layers */}
                {/* Core sun sphere */}
                <mesh>
                    <sphereGeometry args={[5, 32, 32]} />
                    <meshStandardMaterial
                        color="white"
                        emissive="white"
                        emissiveIntensity={1}
                    />
                </mesh>
                {/* Inner glow layer */}
                <mesh>
                    <sphereGeometry args={[7, 32, 32]} />
                    <meshStandardMaterial
                        color="#fff9e6"
                        emissive="#fff9e6"
                        emissiveIntensity={1}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
                {/* Outer glow/halo */}
                <mesh>
                    <sphereGeometry args={[9, 32, 32]} />
                    <meshStandardMaterial
                        color="#fff5cc"
                        emissive="#fff5cc"
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.3}
                    />
                </mesh>

            </group>
        </>
    )
}
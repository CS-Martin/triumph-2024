import { Canvas } from "@react-three/fiber";
import IgnatiusScene from "@/features/3d-model/components/ignatius-scene";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";

interface SceneContainerProps {
    progress: React.RefObject<number>;
    sceneRef: React.RefObject<HTMLDivElement | null>;
}

export function SceneContainer({ progress, sceneRef }: SceneContainerProps) {
    return (
        <div ref={sceneRef} className="fixed inset-0">
            <Canvas dpr={[1, 2]}>
                <IgnatiusScene progress={progress} />
                <EffectComposer multisampling={4}>
                    <Bloom
                        intensity={1.2}
                        luminanceThreshold={0.85}
                        luminanceSmoothing={0.2}
                        mipmapBlur={true}
                        radius={0.6}
                        levels={6}
                    />
                    <Noise opacity={0.05} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
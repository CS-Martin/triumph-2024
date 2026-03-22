import { Canvas } from "@react-three/fiber";
import IgnatiusScene from "@/features/3d-model/components/ignatius-scene";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

interface SceneContainerProps {
    progress: number;
    sceneRef: React.RefObject<HTMLDivElement | null>;
}

export function SceneContainer({ progress, sceneRef }: SceneContainerProps) {
    return (
        <div ref={sceneRef} className="fixed inset-0">
            <Canvas>
                <IgnatiusScene progress={progress} />
                <EffectComposer>
                    <Bloom
                        intensity={1.5}
                        luminanceThreshold={0.6}
                        luminanceSmoothing={0.3}
                        mipmapBlur={true}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
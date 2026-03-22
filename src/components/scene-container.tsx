import { Canvas } from "@react-three/fiber";
import IgnatiusScene from "@/features/3d-model/components/ignatius-scene";

interface SceneContainerProps {
    progress: number;
    sceneRef: React.RefObject<HTMLDivElement | null>;
}

export function SceneContainer({ progress, sceneRef }: SceneContainerProps) {
    return (
        <div ref={sceneRef} className="fixed inset-0">
            <Canvas>
                <IgnatiusScene progress={progress} />
            </Canvas>
        </div>
    );
}

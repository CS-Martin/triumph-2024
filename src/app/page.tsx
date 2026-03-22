'use client';

import IgnatiusScene from "@/features/3d-model/components/ignatius-scene";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const mainRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.timeline({
            scrollTrigger: {
                trigger: mainRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                onUpdate: (self) => {
                    setProgress(self.progress);
                }
            }
        })
            .to(sceneRef.current, {
                ease: 'none',
                x: '35vw',
                y: '100vh',
            })
            .to(sceneRef.current, {
                ease: 'none',
                x: '-35vw',
                y: '200vh',
            })

    }, [])

    return (
        <>
            {/* Main scene */}
            <main ref={mainRef} className="relative">
                <section className="">
                    {/* 3D Model */}
                    <div ref={sceneRef} className="h-screen w-screen border-3 border-red-500">
                        <Canvas>
                            <IgnatiusScene progress={progress} />
                        </Canvas>
                    </div>
                </section>

                {/* Additional sections for scrolling */}
                <section className="h-screen flex items-center justify-center">
                    <div className="max-w-4xl mx-auto px-8 text-center">
                        <h1 className="text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                            Welcome to Triumph 2024
                        </h1>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            Experience an extraordinary journey through innovation, creativity, and achievement.
                            Join us as we celebrate excellence and push the boundaries of what's possible.
                        </p>
                    </div>
                </section>

                <section className="h-screen flex items-center justify-center">
                    <div className="max-w-4xl mx-auto px-8">
                        <h2 className="text-5xl font-bold text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                            About the Event
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                <h3 className="text-2xl font-semibold text-[#c8a44a] mb-4">Innovation</h3>
                                <p className="text-gray-200">
                                    Discover cutting-edge technologies and groundbreaking ideas that are shaping our future.
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                <h3 className="text-2xl font-semibold text-[#c8a44a] mb-4">Excellence</h3>
                                <p className="text-gray-200">
                                    Celebrate outstanding achievements and recognize those who push the limits of possibility.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

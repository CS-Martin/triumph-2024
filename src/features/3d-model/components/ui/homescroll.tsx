"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import IgnatiusScene from "@/features/3d-model/components/ignatius-scene";

gsap.registerPlugin(ScrollTrigger);

export default function HomeScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);

    // Model animation state — driven by GSAP, passed to R3F
    const modelState = useRef({ x: 0, rotY: 0 });
    const [modelX, setModelX] = useState(0);
    const [modelRotY, setModelRotY] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate model from center (x=0) to right (x=2.5)
            // and slightly rotate it to face left as it moves right
            gsap.to(modelState.current, {
                x: 2.5,
                rotY: -0.4,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.2, // smooth lag — feels cinematic
                    onUpdate: () => {
                        setModelX(modelState.current.x);
                        setModelRotY(modelState.current.rotY);
                    },
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        // Tall container — height controls how long the scroll animation lasts
        <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
            {/* Sticky viewport — stays fixed while container scrolls */}
            <div
                ref={stickyRef}
                className="sticky top-0 h-screen w-full overflow-hidden"
            >
                {/* Background */}
                <div className="absolute inset-0 -z-10 bg-[#080808]">
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                            backgroundSize: '128px 128px',
                            mixBlendMode: 'overlay',
                        }}
                    />
                </div>

                {/* 3D Model */}
                <IgnatiusScene modelX={modelX} modelRotY={modelRotY} />

                {/* Hero text — fades out as model moves */}
                <div className="absolute bottom-16 left-12 z-20 max-w-lg pointer-events-none">
                    <h1
                        className="text-[#c8a44a] leading-tight"
                        style={{
                            fontFamily: 'Georgia, "Times New Roman", serif',
                            fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
                            fontStyle: 'italic',
                            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                        }}
                    >
                        Every Thread Of
                        <br />
                        Struggle, A Tapestry
                        <br />
                        Of Triumph.
                    </h1>
                </div>

                {/* Right body copy */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 max-w-sm pointer-events-none">
                    <p className="text-[#d4c49a] text-sm leading-relaxed mb-4 text-justify" style={{ fontFamily: 'Georgia, serif' }}>
                        Rooted in Ignatian spirituality and the enduring values of Ateneo
                        de Naga University, the Batch of 2024 embraces this theme as a
                        reflection of their transformative journey. Their years in the
                        University were not defined solely by achievements, but by the
                        countless unseen sacrifices, quiet perseverance, and steadfast faith
                        that shaped them along the way.
                    </p>
                    <p className="text-[#d4c49a] text-sm leading-relaxed mb-4 text-justify" style={{ fontFamily: 'Georgia, serif' }}>
                        Through cura personalis, they learned to care not only for their
                        intellect but for their character and well-being. In striving for
                        magis, they pursued excellence with purpose, always seeking the
                        greater good.
                    </p>
                    <p className="text-[#d4c49a] text-sm leading-relaxed text-justify" style={{ fontFamily: 'Georgia, serif' }}>
                        Their triumph, therefore, is more than graduation, it is the
                        culmination of resilience, integrity, and faith lived out daily.
                        Truly, every thread of struggle has formed a tapestry of triumph,
                        distinctly Ignatian and uniquely their own.
                    </p>
                </div>
            </div>
        </div>
    );
}
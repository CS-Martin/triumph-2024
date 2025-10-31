"use client";

import { SignIn } from "@clerk/nextjs";
import TriumphScene from "@/features/3d-model/components/triumph-scene";

export default function TriumphHomePage() {
    return (
        <div className="min-h-screen w-full flex relative overflow-hidden" style={{ backgroundColor: '#131210' }}>
            <div className="flex-1 relative overflow-hidden border-l border-purple-500/30">
                <div className="absolute inset-0">
                    <TriumphScene />
                </div>

                {/* Floating UI elements */}
                <div className="absolute top-8 left-8 z-10">
                    <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg border border-purple-500/30 p-4 shadow-lg">
                        <div className="text-purple-400 font-semibold text-sm mb-1">Interactive Model</div>
                        <div className="text-slate-400 text-xs">Drag to rotate • Scroll to zoom</div>
                    </div>
                </div>
            </div>

            {/* Clerk Sign-In - Absolutely positioned on the right side */}
            <div className="absolute top-0 right-0 h-full z-20 flex items-center">
                <div className="pr-8">
                    <SignIn />
                </div>
            </div>
        </div>
    );
}
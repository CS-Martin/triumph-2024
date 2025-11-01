import TriumphScene from '@/features/3d-model/components/triumph-scene'
import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignInPage() {
    return (
        <div className="min-h-screen w-full flex relative overflow-hidden" style={{ backgroundColor: '#010100' }}>
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
            <div className="absolute top-0 right-[10%] h-full z-20 flex flex-col justify-center items-center max-w-[600px]">
                <div>
                    <Image src="/triumph-title.svg" alt="Triumph Yearbook 2024" width={500} height={500} className="w-[500px] h-auto" />
                </div>
                <div className="pr-8">
                    A tribute to the journeys that have shaped them and the memories that will stay with them long after they leave the campus. It is more than a book of photographs—it is a testament to late nights of perseverance, friendships that became family, and moments that defined the Atenean spirit. Triumph honors the struggles overcome, the milestones achieved, and the dreams nurtured within these walls. As seniors turn the page to new beginnings, this yearbook stands as a reminder that their story, their triumph, will forever be part of the Ateneo community.
                    <SignIn />
                </div>
            </div>
        </div>
    )
}
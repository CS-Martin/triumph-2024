import Fireflies from '@/components/ui/fireflies'
import TriumphScene from '@/features/3d-model/components/triumph-scene'
import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignInPage() {
    return (
        <div className="flex isolate h-screen w-full" style={{ backgroundColor: '#010100' }}>
            <div className="flex-1 z-10 relative overflow-hidden border-l">
                <div className="absolute inset-0">
                    <TriumphScene />
                </div>
            </div>

            {/* Clerk Sign-In - Absolutely positioned on the right side */}
            <div className="absolute pointer-events-none top-0 right-[10%] h-full z-20 flex flex-col justify-center items-center max-w-[500px]">
                <div>
                    <Image src="/triumph-title.svg" alt="Triumph Yearbook 2024" width={500} height={500} className="w-[500px] h-auto" />
                </div>
                <div className='w-full max-w-[500px] flex flex-col items-center mt-6'>
                    {/* Subtitle */}
                    <p className='text-[#979797] text-justify'>
                        More than a book of photographs, Triumph is a testament to late nights of perseverance, friendships that became family, and moments that defined the Atenean spirit. It honors the struggles overcome, milestones achieved, and dreams that will forever connect them to the Ateneo community.
                    </p>
                    <div className='w-full flex justify-center pointer-events-auto'>
                        <SignIn />
                    </div>
                </div>
            </div>

            <Fireflies />
        </div>
    )
}
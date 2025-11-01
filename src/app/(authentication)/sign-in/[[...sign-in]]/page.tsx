"use client"

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import Fireflies from '@/components/ui/fireflies'
import TriumphScene from '@/features/3d-model/components/triumph-scene'
import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignInPage() {
    const [showContent, setShowContent] = useState(false)

    // Wait for scene to load and zoom animation to complete before showing Sign In
    useEffect(() => {
        // Scene load delay (500ms) + zoom animation (2000ms) + buffer (300ms) = 2.8s
        const timer = setTimeout(() => {
            setShowContent(true)
        }, 2800)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="flex isolate h-screen w-full" style={{ backgroundColor: '#010100' }}>
            <div className="flex-1 z-10 relative overflow-hidden border-l">
                <div className="absolute inset-0">
                    <TriumphScene />
                </div>
            </div>

            {/* Clerk Sign-In - Absolutely positioned on the right side */}
            {showContent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute pointer-events-none top-0 right-[10%] h-full z-20 flex flex-col justify-center items-center max-w-[500px]"
                >
                    {/* Title with slide and scale animation */}
                    <motion.div
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            delay: 0.2
                        }}
                    >
                        <Image src="/triumph-title.svg" alt="Triumph Yearbook 2024" width={500} height={500} className="w-[500px] h-auto" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.5,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                        className='w-full max-w-[500px] flex flex-col items-center mt-6'
                    >
                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.7
                            }}
                            className='text-[#979797] text-justify'
                        >
                            More than a book of photographs, Triumph is a testament to late nights of perseverance, friendships that became family, and moments that defined the Atenean spirit. It honors the struggles overcome, milestones achieved, and dreams that will forever connect them to the Ateneo community.
                        </motion.p>

                        {/* Sign In form with slide up animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 20,
                                delay: 0.9
                            }}
                            className='w-full flex justify-center pointer-events-auto'
                        >
                            <SignIn />
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}

            <Fireflies />
        </div>
    )
}
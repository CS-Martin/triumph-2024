"use client"

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import Fireflies from '@/components/ui/fireflies'
import TriumphScene from '@/features/3d-model/components/triumph-scene'
import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignInPage() {
    const [showContent, setShowContent] = useState(false)

    // Wait for scene to load and zoom animation to complete before showing Sign In on desktop
    // On mobile, show content immediately since there's no 3D scene
    useEffect(() => {
        const isMobile = window.innerWidth < 1024 // lg breakpoint
        if (isMobile) {
            // Show immediately on mobile
            setShowContent(true)
        } else {
            // Scene load delay (500ms) + zoom animation (2000ms) + buffer (300ms) = 2.8s
            const timer = setTimeout(() => {
                setShowContent(true)
            }, 2800)
            return () => clearTimeout(timer)
        }
    }, [])

    return (
        <div className="flex isolate h-screen w-full relative" style={{ backgroundColor: '#010100' }}>
            {/* 3D Scene - Hidden on mobile, visible on large screens */}
            <div className="hidden lg:flex flex-1 z-10 relative overflow-hidden border-l">
                <div className="absolute inset-0">
                    <TriumphScene axes={{ x: -23, y: -28, depth: -175 }} />
                </div>
            </div>

            {/* Clerk Sign-In - Centered on mobile, absolutely positioned on right for desktop */}
            {showContent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="
                        pointer-events-none 
                        w-full lg:w-auto
                        absolute lg:right-[10%] 
                        top-0 h-full z-20 
                        flex flex-col justify-center items-center 
                        px-4 sm:px-6 md:px-8 lg:px-0
                        2xl:max-w-[500px] xl:max-w-[400px] lg:max-w-[400px] max-w-full
                    "
                >
                    {/* Title with fade and scale animation (mobile) */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            delay: 0.1
                        }}
                        className="lg:hidden"
                    >
                        <Image
                            src="/triumph-title.svg"
                            alt="Triumph Yearbook 2024"
                            width={500}
                            height={500}
                            className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] h-auto"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            delay: 0.2
                        }}
                        className="hidden lg:block"
                    >
                        <Image src="/triumph-title.svg" alt="Triumph Yearbook 2024" width={500} height={500} className="2xl:w-[500px] xl:w-[400px] w-[400px] h-auto" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.5,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                        className='w-full max-w-[500px] flex flex-col items-center mt-4 sm:mt-6'
                    >
                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.7
                            }}
                            className='text-[#979797] text-xs sm:text-sm md:text-base 2xl:text-base text-center lg:text-justify px-2 sm:px-0'
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
                            className='w-full flex justify-center pointer-events-auto mt-4 sm:mt-6'
                        >
                            <SignIn />
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}

            {/* Fireflies - Hidden on mobile for better performance */}
            <div className="hidden lg:block">
                <Fireflies />
            </div>
        </div>
    )
}
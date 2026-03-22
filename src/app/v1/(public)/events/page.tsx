"use client"

import { motion, useTransform, useScroll, useInView } from "motion/react"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { Beau_Rivage } from "next/font/google"
import GoBackButton from "@/features/3d-model/components/ui/go-back-button"
import { events } from "@/features/event/lib/constants"

const beau_rivage = Beau_Rivage({
    variable: "--font-beau-rivage",
    subsets: ["latin"],
    weight: ["400"],
});

// Sample events data - replace with actual data source


export default function EventsPage() {
    const [screenSize, setScreenSize] = useState<number | null>(null)
    const targetRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: targetRef,
    })

    useEffect(() => {
        // Set initial screen size
        setScreenSize(window.innerWidth)

        const handleResize = () => {
            setScreenSize(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Calculate scroll multiplier based on screen size
    const scrollMultiplier = useMemo(() => {
        if (screenSize === null) {
            // Default to desktop value while screen size is being determined
            return 100
        }
        if (screenSize < 768) {
            // Mobile
            return 196
        }
        if (screenSize >= 768 && screenSize < 1024) {
            // Tablet
            return 130
        }
        if (screenSize >= 1024 && screenSize < 1280) {
            // Small Laptop
            return 124
        }
        if (screenSize >= 1280 && screenSize < 1536) {
            // Large Laptop
            return 150
        }
        if (screenSize >= 1536) {
            // Default Laptop
            return 102
        }
        // Large Desktop (default)
        return 100
    }, [screenSize])

    // Transform horizontal position based on scroll progress
    // Always call useTransform unconditionally (React Hooks rule)
    // Use function callback to ensure reactivity when scrollMultiplier changes
    const x = useTransform(
        scrollYProgress,
        (latest) => {
            const offset = (events.length - 1) * scrollMultiplier
            return `${-latest * offset}%`
        }
    )

    return (
        <main className="relative h-[400vh]">
            <section
                ref={targetRef}
                className='relative h-[400vh]'
            >
                {/* Horizontal Scroll of Events */}
                <div className='sticky top-0 h-screen flex items-center overflow-hidden'>
                    {/* Background image for all pages */}
                    <div className='absolute inset-0 w-full h-full z-0'>
                        <Image
                            src="/events/university-events-bg.webp"
                            alt="University Events Background"
                            fill
                            className='object-cover'
                            priority
                        />
                        <div className='absolute inset-0 bg-black/40 z-10'></div>
                    </div>

                    <motion.div
                        style={{ x }}
                        className='flex z-50 relative'
                    >
                        {events.map((event) => (
                            <EventPage
                                key={event.id}
                                event={event}
                            />
                        ))}
                    </motion.div>

                    {/* Go Back Button */}
                    <GoBackButton
                        isVisible={true}
                        onClose={() => {
                            window.location.href = '/'
                        }}
                    />
                </div>
            </section>
        </main>
    )
}

type EventPageProps = {
    event: typeof events[0]
}

const EventPage = ({ event }: EventPageProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, amount: 0.2 })

    return (
        <div
            ref={containerRef}
            className="shrink-0 w-[140%] md:w-full 2xl:w-full h-screen flex items-center justify-center"
        >
            <div className="flex flex-row gap-x-3 w-full h-full min-h-screen z-20 relative">
                {/* Style Statue - Takes 1 column, spans 2 rows */}
                <motion.div
                    className="relative w-[80%] 2xl:w-full h-full"
                    initial={{ opacity: 0, scale: 0.95, x: -30 }}
                    animate={isInView ? {
                        opacity: 1,
                        scale: 1,
                        x: 0
                    } : { opacity: 0, scale: 0.95, x: -30 }}
                    transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.3
                    }}
                >
                    <motion.div
                        className={event.feature.className}
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{
                            duration: 1.5,
                            delay: 0.5
                        }}
                    >
                        <Image
                            src={event.feature.image}
                            alt={event.feature.title}
                            fill
                            className="object-cover w-full h-full"
                        />
                    </motion.div>


                </motion.div>

                {/* Event Statues - 3 items in 1 column */}
                {event.eventStatues.map((statue, index) => {
                    return (
                        <motion.div
                            key={index}
                            className={`relative w-full 2xl:w-full h-full flex flex-col ${statue.containerClassName || ''}`}
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={isInView ? {
                                opacity: 1,
                                y: 0,
                                scale: 1
                            } : { opacity: 0, y: 50, scale: 0.95 }}
                            transition={{
                                duration: 1,
                                delay: 0.5 + (index * 0.2),
                                ease: [0.22, 1, 0.36, 1]
                            }}
                        >
                            {/* Picture Frame Container - Allow dynamic sizing */}
                            <motion.div
                                className={`relative w-full ${statue.imageClassName || 'h-1/2'} shrink-0`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={isInView ? {
                                    opacity: 1,
                                    scale: 1
                                } : { opacity: 0, scale: 0.9 }}
                                transition={{
                                    duration: 1.2,
                                    delay: 0.7 + (index * 0.2),
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                            >
                                <Image
                                    src={statue.image}
                                    alt={statue.title}
                                    fill
                                    className="object-contain"
                                />
                            </motion.div>

                            {/* Title and Description - Positioned right below the image container */}
                            <motion.div
                                className={` flex flex-col justify-start items-center flex-1 min-h-0 ${statue.titleClassName || ''}`}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? {
                                    opacity: 1,
                                    y: 0
                                } : { opacity: 0, y: 30 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.9 + (index * 0.2),
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                            >
                                <motion.h3
                                    className={`text-lg md:text-6xl text-center font-bold text-[#F4E590] mb-1 md:mb-2 ${beau_rivage.variable} ${beau_rivage.className}`}
                                    initial={{ opacity: 0, y: 20, letterSpacing: "-0.05em" }}
                                    animate={isInView ? {
                                        opacity: 1,
                                        y: 0,
                                        letterSpacing: "0.05em"
                                    } : { opacity: 0, y: 20, letterSpacing: "-0.05em" }}
                                    transition={{
                                        duration: 0.9,
                                        delay: 1.1 + (index * 0.2),
                                        ease: [0.22, 1, 0.36, 1]
                                    }}
                                >
                                    {statue.title}
                                </motion.h3>
                                <motion.p
                                    className="text-sm md:text-base text-white text-center"
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                                    transition={{
                                        duration: 1,
                                        delay: 1.3 + (index * 0.2),
                                        ease: "easeOut"
                                    }}
                                >
                                    {statue.description}
                                </motion.p>

                                {/* Decorative underline */}
                                <motion.div
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-[#F4E590]/60"
                                    initial={{ scaleX: 0 }}
                                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                                    transition={{ duration: 0.6, delay: 1.5 + (index * 0.2), ease: "easeInOut" }}
                                    style={{ transformOrigin: "center" }}
                                />
                            </motion.div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
"use client"

import { motion, useTransform, useScroll } from "motion/react"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { Beau_Rivage } from "next/font/google"

const beau_rivage = Beau_Rivage({
    variable: "--font-beau-rivage",
    subsets: ["latin"],
    weight: ["400"],
});

// Sample events data - replace with actual data source
const events = [
    {
        id: 1,
        title: "Page 1",
        feature: {
            image: "/events/plant1.webp",
            title: "Plant 1",
            className: "absolute left-1/2 -translate-x-1/2 -bottom-60 md:-bottom-80 w-full h-full"
        },
        eventStatues: [
            {
                image: "/events/frame1.webp",
                title: "Orsem",
                link: "/events/1",
                description: 'Ateneo vibrant welcome tradition. Where freshies are introduced to campus life, Atenean culture, and the spirit of community through cheers, performances, and unforgettable memories.',
                imageClassName: "h-[40%]",
                titleClassName: "",
                containerClassName: "mt-20 2xl:mt-20"
            },
            {
                image: "/events/frame2.webp",
                title: "St. Ignatius Day",
                link: "/events/2",
                description: `The feast of our founder, St. Ignatius of Loyola. A day of faith, fun, and community, filled with Masses, performances, and Ignatian spirit all around campus.`,
                imageClassName: "h-[55%]",
                titleClassName: "",
                containerClassName: "mt-40 2xl:mt-45"
            },
            {
                image: "/events/frame3.webp",
                title: "Mass of the Holy Spirit",
                link: "/events/3",
                description: `Coming together as one Ateneo community to pray for wisdom, courage, and grace for the months ahead.`,
                imageClassName: "h-[50%]",
                titleClassName: "",
                containerClassName: "mt-2 2xl:mt-10"
            }
        ]
    },
    {
        id: 2,
        title: "Page 2",
        feature: {
            image: "/events/lamp.webp",
            title: "Lamp 2",
            className: "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/3 w-full 2xl:w-[60%] h-1/2 object-cover"
        },
        eventStatues: [
            {
                image: "/events/frame4.webp",
                title: "Traslacion",
                link: "/events/4",
                description: "Millions of devotees join the procession, many barefoot, as an act of penitence, thanksgiving, and devotion.",
                imageClassName: "h-[50%]",
                titleClassName: "",
                containerClassName: "mt-20 2xl:mt-30"
            },
            {
                image: "/events/frame5.webp",
                title: "Peñafrancia Fiesta",
                link: "/events/5",
                description: "Viva la Virgen! The Peñafrancia Fiesta unites Bicolanos and devotees from all over in a vibrant celebration of faith, culture, and devotion to Our Lady of Peñafrancia.",
                imageClassName: "h-[50%]",
                titleClassName: "",
                containerClassName: "mt-35 2xl:mt-50"
            },
            {
                image: "/events/frame6.webp",
                title: "Alternative Class Program",
                link: "/events/6",
                description: "Takes learning outside the classroom—through talks, workshops, and experiences that open minds, spark conversations, and inspire action.",
                imageClassName: "h-[50%]",
                titleClassName: "",
                containerClassName: "mt-20 2xl:mt-10"
            }
        ]
    },
    {
        id: 3,
        title: "Page 3",
        feature: {
            image: "/events/plant2.webp",
            title: "Plant 2",
            className: "absolute left-1/2 -translate-x-1/2 -bottom-60 w-full h-full"
        },
        eventStatues: [
            {
                image: "/events/frame7.webp",
                title: "St. Francis Xavier Day",
                link: "/events/7",
                description: "Honoring the Jesuit missionary spirit of courage, faith, and service that continues to inspire Ateneans today.",
                imageClassName: "h-[50%]",
                titleClassName: "",
                containerClassName: "mt-35 2xl:mt-50"
            },
            {
                image: "/events/frame8.webp",
                title: "Orgs Fest",
                link: "/events/8",
                description: "Where orgs bring the campus to life with booths, games, and performances, all while welcoming new members into their families.",
                imageClassName: "h-[50%]",
                titleClassName: "",
                containerClassName: "mt-10 2xl:mt-10"
            },
            {
                image: "/events/frame9.webp",
                title: "Dugong Atenista",
                link: "/events/9",
                description: "Ateneo’s annual bloodletting activity that embodies the spirit of generosity and solidarity. Through this initiative, students, faculty, and staff come together to donate blood and help save lives—living out the Atenean value of being men and women for others.",
                imageClassName: "h-[50%]",
                titleClassName: "",
                containerClassName: "mt-20 2xl:mt-40"
            }
        ]
    },
]

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
                </div>
            </section>
        </main>
    )
}

type EventPageProps = {
    event: typeof events[0]
}

const EventPage = ({ event }: EventPageProps) => {
    return (
        <div className="shrink-0 w-[140%] md:w-full 2xl:w-full h-screen flex items-center justify-center">
            <div className="flex flex-row gap-x-3 w-full h-full min-h-screen z-20 relative">
                {/* Style Statue - Takes 1 column, spans 2 rows */}
                <div className="relative w-[80%] 2xl:w-full h-full">
                    <div className={event.feature.className}>
                        <Image
                            src={event.feature.image}
                            alt={event.feature.title}
                            fill
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
                {/* Event Statues - 3 items in 1 column */}
                {event.eventStatues.map((statue, index) => {
                    return (
                        <div key={index} className={`relative w-full 2xl:w-full h-full flex flex-col ${statue.containerClassName || ''}`}>
                            {/* Picture Frame Container - Allow dynamic sizing */}
                            <div className={`relative w-full ${statue.imageClassName || 'h-1/2'} shrink-0`}>
                                <Image
                                    src={statue.image}
                                    alt={statue.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* Title and Description - Positioned right below the image container */}
                            <div className={`pb-4 px-4 md:pb-6 md:px-6 flex flex-col justify-start items-center flex-1 min-h-0 ${statue.titleClassName || ''}`}>
                                <h3 className={`text-lg md:text-6xl text-center font-bold text-[#F4E590] mb-1 md:mb-2 ${beau_rivage.variable} ${beau_rivage.className}`}>
                                    {statue.title}
                                </h3>
                                <p className="text-sm md:text-base text-white text-center">
                                    {statue.description}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
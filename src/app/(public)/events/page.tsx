"use client"

import { motion, useTransform, useScroll } from "motion/react"
import Image from "next/image"
import { useRef } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
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
        title: "Event 1",
        description: "Description 1",
        feature: {
            image: "/events/plant1.webp",
            title: "Plant 1",
            className: "absolute left-1/2 -translate-x-1/2 -bottom-60 w-full h-full"
        },
        eventStatues: [
            {
                image: "/events/frame1.webp",
                title: "Orsem",
                link: "/events/1",
                description: 'Ateneo vibrant welcome tradition. Where freshies are introduced to campus life, Atenean culture, and the spirit of community through cheers, performances, and unforgettable memories.',
                imageClassName: "h-[40%]",
                titleClassName: "",
                containerClassName: ""
            },
            {
                image: "/events/frame2.webp",
                title: "St. Ignatius Day",
                link: "/events/2",
                description: `The feast of our founder, St. Ignatius of Loyola. A day of faith, fun, and community, filled with Masses, performances, and Ignatian spirit all around campus.`,
                imageClassName: "h-[55%]",
                titleClassName: "",
                containerClassName: ""
            },
            {
                image: "/events/frame3.webp",
                title: "Mass of the Holy Spirit",
                link: "/events/3",
                description: `Coming together as one Ateneo community to pray for wisdom, courage, and grace for the months ahead.`,
                imageClassName: "h-[40%]",
                titleClassName: "",
                containerClassName: ""
            }
        ]
    },
    {
        id: 2,
        title: "Event 2",
        description: "Description 2",
        feature: {
            image: "/events/lamp.webp",
            title: "Lamp 2",
            className: "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/3 w-[60%] h-1/2 object-cover"
        },
        eventStatues: [
            {
                image: "/images/event-statue-4.jpg",
                title: "Event Statue 4",
                link: "/events/4",
                description: 'A symbol of resilience and hope, the Lamplighter statue commemorates the sacrifices made by the fallen during World War I. Its presence reminds us of the importance of remembering and honoring those who have served and sacrificed for our freedom.',
                imageClassName: "",
                titleClassName: "",
                containerClassName: "justify-start"
            },
            {
                image: "/images/event-statue-5.jpg",
                title: "Event Statue 5",
                link: "/events/5",
                description: 'A symbol of resilience and hope, the Lamplighter statue commemorates the sacrifices made by the fallen during World War I. Its presence reminds us of the importance of remembering and honoring those who have served and sacrificed for our freedom.',
                imageClassName: "",
                titleClassName: "",
                containerClassName: "justify-end"
            },
            {
                image: "/images/event-statue-6.jpg",
                title: "Event Statue 6",
                link: "/events/6",
                description: 'A symbol of resilience and hope, the Lamplighter statue commemorates the sacrifices made by the fallen during World War I. Its presence reminds us of the importance of remembering and honoring those who have served and sacrificed for our freedom.',
                imageClassName: "",
                titleClassName: "",
                containerClassName: "justify-start"
            }
        ]
    },
    {
        id: 3,
        title: "Event 3",
        description: "Description 3",
        feature: {
            image: "/images/style-statue-3.jpg",
            title: "Style Statue 3"
        },
        eventStatues: [
            {
                image: "/images/event-statue-7.jpg",
                title: "Event Statue 7",
                link: "/events/7",
                description: 'A symbol of resilience and hope, the Lamplighter statue commemorates the sacrifices made by the fallen during World War I. Its presence reminds us of the importance of remembering and honoring those who have served and sacrificed for our freedom.',
                imageClassName: "",
                titleClassName: "",
                containerClassName: "justify-start"
            },
            {
                image: "/images/event-statue-8.jpg",
                title: "Event Statue 8",
                link: "/events/8",
                description: 'A symbol of resilience and hope, the Lamplighter statue commemorates the sacrifices made by the fallen during World War I. Its presence reminds us of the importance of remembering and honoring those who have served and sacrificed for our freedom.',
                imageClassName: "",
                titleClassName: "",
                containerClassName: "justify-end"
            },
            {
                image: "/images/event-statue-9.jpg",
                title: "Event Statue 9",
                link: "/events/9",
                description: 'A symbol of resilience and hope, the Lamplighter statue commemorates the sacrifices made by the fallen during World War I. Its presence reminds us of the importance of remembering and honoring those who have served and sacrificed for our freedom.',
                imageClassName: "",
                titleClassName: "",
                containerClassName: "justify-start"
            }
        ]
    },
]

export default function EventsPage() {
    const targetRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: targetRef,
    })

    // Transform horizontal position based on scroll progress
    // Adjust based on number of events: -(numberOfEvents - 1) * 100
    const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(events.length - 1) * 100}%`])

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
        <div className="shrink-0 w-screen h-screen flex items-center justify-center">
            {/* Grid Layout: 1 style statue + 3 event statues */}
            <div className="grid grid-cols-4 w-full h-full max-h-screen z-20 relative">
                {/* Style Statue - Takes 1 column, spans 2 rows */}
                <div className="relative w-full h-full">
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
                        <div key={index} className={`relative w-full h-full flex flex-col ${statue.containerClassName || ''}`}>
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
                                <h3 className={`text-lg md:text-7xl font-bold text-[#F4E590] mb-1 md:mb-2 ${beau_rivage.variable} ${beau_rivage.className}`}>
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
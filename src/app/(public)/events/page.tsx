"use client"

import { motion, useTransform, useScroll } from "motion/react"
import Image from "next/image"
import { useRef } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

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
                image: "/images/event-statue-1.jpg",
                title: "Event Statue 1",
                link: "/events/1"
            },
            {
                image: "/images/event-statue-2.jpg",
                title: "Event Statue 2",
                link: "/events/2"
            },
            {
                image: "/images/event-statue-3.jpg",
                title: "Event Statue 3",
                link: "/events/3"
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
                link: "/events/4"
            },
            {
                image: "/images/event-statue-5.jpg",
                title: "Event Statue 5",
                link: "/events/5"
            },
            {
                image: "/images/event-statue-6.jpg",
                title: "Event Statue 6",
                link: "/events/6"
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
                link: "/events/7"
            },
            {
                image: "/images/event-statue-8.jpg",
                title: "Event Statue 8",
                link: "/events/8"
            },
            {
                image: "/images/event-statue-9.jpg",
                title: "Event Statue 9",
                link: "/events/9"
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
                            className="object-cover"
                        />
                    </div>
                </div>
                {/* Event Statues - 3 items in 1 column */}
                {event.eventStatues.map((statue, index) => (
                    <div key={index} className="relative w-full h-full">
                        <Image
                            src={statue.image}
                            alt={statue.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
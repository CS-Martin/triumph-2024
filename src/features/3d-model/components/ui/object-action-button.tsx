"use client"

import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useCameraStore } from "../../stores/camera-store"

// Mapping of object IDs to their action links
const OBJECT_LINKS: Record<string, string> = {
    phonograph: "/events",
    chair: "/student-life",
    lamp: "/memories",
    moon: "/evening-stories",
}

// Mapping of object IDs to their action button labels
const OBJECT_ACTION_LABELS: Record<string, string> = {
    phonograph: "Explore Events",
    chair: "View Life",
    lamp: "Browse Memories",
    moon: "Read Stories",
}

export default function ObjectActionButton() {
    const focusedObjectId = useCameraStore((state) => state.focusedObjectId)
    const link = focusedObjectId ? OBJECT_LINKS[focusedObjectId] : null
    const label = focusedObjectId ? OBJECT_ACTION_LABELS[focusedObjectId] : null

    return (
        <AnimatePresence>
            {link && label && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        delay: 0.2 // Slight delay after title appears
                    }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                >
                    <Link href={link}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative cursor-pointer flex items-center gap-4 px-8 py-4 bg-black/80 backdrop-blur-md border-2 border-[#F4E590]/40 hover:border-[#F4E590] transition-all group"
                        >
                            {/* Victorian decorative corner elements */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#F4E590] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[#F4E590] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[#F4E590] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#F4E590] opacity-60 group-hover:opacity-100 transition-opacity"></div>

                            {/* Top and bottom decorative lines */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#F4E590]/60 to-transparent group-hover:via-[#F4E590] transition-all"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#F4E590]/60 to-transparent group-hover:via-[#F4E590] transition-all"></div>

                            {/* Left and right decorative vertical lines */}
                            <div className="absolute top-0 bottom-0 left-0 w-px bg-linear-to-b from-transparent via-[#F4E590]/60 to-transparent group-hover:via-[#F4E590] transition-all"></div>
                            <div className="absolute top-0 bottom-0 right-0 w-px bg-linear-to-b from-transparent via-[#F4E590]/60 to-transparent group-hover:via-[#F4E590] transition-all"></div>

                            {/* Button text */}
                            <span
                                className="text-base md:text-lg font-serif text-[#F4E590] tracking-wider group-hover:tracking-widest transition-all"
                                style={{ fontFamily: 'var(--font-rosarivo), serif' }}
                            >
                                {label}
                            </span>

                            {/* Arrow icon */}
                            <ArrowRight className="w-5 h-5 text-[#F4E590] group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    )
}


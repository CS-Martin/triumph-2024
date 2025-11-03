"use client"

import { motion, AnimatePresence } from "motion/react"
import { useCameraStore } from "../../stores/camera-store"

// Mapping of object IDs to their display titles
const OBJECT_TITLES: Record<string, string> = {
    phonograph: "University Events",
    chair: "Student Life",
    lamp: "Memories",
    moon: "Evening Stories",
}

export default function ObjectTitle() {
    const hoveredObjectId = useCameraStore((state) => state.hoveredObjectId)
    const focusedObjectId = useCameraStore((state) => state.focusedObjectId)

    // Show title when object is hovered or focused
    const activeObjectId = focusedObjectId || hoveredObjectId
    const title = activeObjectId ? OBJECT_TITLES[activeObjectId] : null

    return (
        <AnimatePresence>
            {title && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                    }}
                    className="fixed top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                >
                    {/* Victorian-themed container with ornate borders */}
                    <div className="relative px-8 py-4 bg-black/80 backdrop-blur-md">
                        {/* Ornate top border */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F4E590] to-transparent"></div>

                        {/* Decorative corner elements */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#F4E590]"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[#F4E590]"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[#F4E590]"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#F4E590]"></div>

                        {/* Ornate bottom border */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F4E590] to-transparent"></div>

                        {/* Title text with Victorian styling */}
                        <h2
                            className="text-2xl md:text-3xl font-serif text-[#F4E590] tracking-wider"
                            style={{ fontFamily: 'var(--font-rosarivo), serif' }}
                        >
                            {title}
                        </h2>

                        {/* Decorative underline */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-[#F4E590]/60"></div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}


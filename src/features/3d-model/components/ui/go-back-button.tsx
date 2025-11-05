"use client"

import { motion, AnimatePresence } from "motion/react"
import { ArrowLeft } from "lucide-react"
import { SignOutButton } from "@clerk/nextjs"

type GoBackButtonProps = {
    isVisible: boolean
    onClose: () => void
}

export default function GoBackButton({ isVisible, onClose }: GoBackButtonProps) {
    return (
        <AnimatePresence>

            {isVisible && (
                <>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25
                        }}
                        onClick={onClose}
                        className="fixed top-8 left-8 z-50 flex items-center gap-3 px-2 2xl:px-6 2xl:py-3 py-2 bg-black/80 backdrop-blur-md border-2 border-[#F4E590]/40 hover:border-[#F4E590] transition-all group"
                        aria-label="Go back"
                    >
                        {/* Victorian decorative corner elements */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#F4E590] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#F4E590] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#F4E590] opacity-60 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#F4E590] opacity-60 group-hover:opacity-100 transition-opacity"></div>

                        {/* Top and bottom decorative lines */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F4E590]/60 to-transparent group-hover:via-[#F4E590] transition-all"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F4E590]/60 to-transparent group-hover:via-[#F4E590] transition-all"></div>

                        <ArrowLeft className="2xl:w-5 2xl:h-5 w-4 h-4 text-[#F4E590] group-hover:translate-x-[-2px] transition-transform" />
                        <span
                            className="text-xs font-serif text-[#F4E590] tracking-wider group-hover:tracking-widest 2xl:text-base transition-all"
                        >
                            Go Back
                        </span>
                    </motion.button>
                    <SignOutButton />
                </>
            )}
        </AnimatePresence>
    )
}


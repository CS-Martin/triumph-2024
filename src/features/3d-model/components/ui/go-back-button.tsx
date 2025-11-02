"use client"

import { motion, AnimatePresence } from "motion/react"
import { X } from "lucide-react"

type GoBackButtonProps = {
    isVisible: boolean
    onClose: () => void
}

export default function GoBackButton({ isVisible, onClose }: GoBackButtonProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                    }}
                    onClick={onClose}
                    className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-black/80 transition-colors"
                    aria-label="Go back"
                >
                    <X className="w-5 h-5" />
                    <span className="text-sm font-medium">Go Back</span>
                </motion.button>
            )}
        </AnimatePresence>
    )
}


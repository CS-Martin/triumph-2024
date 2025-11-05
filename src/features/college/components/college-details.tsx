import { motion } from "motion/react"
import { useInView } from "motion/react"
import { Sofia_Sans_Condensed, Trocchi } from "next/font/google"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { COLLEGE_DATA } from "@/features/college/lib/constants"
import { useRef } from "react"

const trocchi = Trocchi({
    variable: "--font-trocchi",
    subsets: ["latin"],
    weight: ["400"],
})

const sofia_sans_condensed = Sofia_Sans_Condensed({
    variable: "--font-sofia-sans-condensed",
    subsets: ["latin"],
    weight: ["400"],
})

type CollegeDetailsProps = {
    collegeName: string
}

export const CollegeDetails = ({ collegeName }: CollegeDetailsProps) => {
    const collegeInfo = COLLEGE_DATA[collegeName]
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, amount: 0.2 })

    return (
        <motion.div
            ref={containerRef}
            className="flex flex-col justify-center space-y-6 lg:space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.3
            }}
        >
            {/* Title */}
            <div className="text-center">
                <motion.div className={`uppercase 2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl sm:text-lg font-bold text-[#F4E590] ${sofia_sans_condensed.variable} ${sofia_sans_condensed.className}`}>COLLEGE OF</motion.div>
                <motion.h1
                    className={`text-2xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#F4E590] ${trocchi.variable} ${trocchi.className}`}
                    initial={{ opacity: 0, y: 30, letterSpacing: "-0.05em" }}
                    animate={isInView ? {
                        opacity: 1,
                        y: 0,
                        letterSpacing: "0.05em"
                    } : { opacity: 0, y: 30, letterSpacing: "-0.05em" }}
                    transition={{
                        duration: 1,
                        delay: 0.5,
                        ease: [0.22, 1, 0.36, 1]
                    }}
                >
                    {collegeInfo.title}
                </motion.h1>
            </div>

            {/* Description */}
            <motion.p
                className="text-base sm:text-lg md:text-xl lg:text-base text-justify text-white leading-relaxed 2xl:max-h-[400px] xl:max-h-[300px] lg:max-h-[200px] md:max-h-[100px] sm:max-h-[50px] max-h-[20px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#F4E590] scrollbar-track-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                    duration: 0.8,
                    delay: 0.7,
                    ease: [0.22, 1, 0.36, 1]
                }}
            >
                {collegeInfo.description}
            </motion.p>

            {/* View Graduates Link */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                    duration: 0.8,
                    delay: 0.9,
                    ease: [0.22, 1, 0.36, 1]
                }}
            >
                <Link href={`/colleges/${collegeName}/graduates`}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative cursor-pointer flex items-center gap-2 transition-all group"
                    >
                        {/* Button text */}
                        <span
                            className="text-center md:text-left md:text-base text-[#F4E590] hover:underline"
                        >
                            View Graduates
                        </span>

                        {/* Arrow icon */}
                        <ArrowRight className="w-5 h-5 text-[#F4E590] group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </Link>
            </motion.div>
        </motion.div>
    )
}
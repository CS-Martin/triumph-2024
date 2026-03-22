"use client"

import { motion, useInView } from "motion/react"
import Image from "next/image"
import { useRef, use } from "react"
import GoBackButton from "@/features/3d-model/components/ui/go-back-button"
import { COLLEGE_DATA } from "@/features/college/lib/constants"
import { CollegeDetails } from "@/features/college/components/college-details"

// Mapping of college names to their statue images
const COLLEGE_STATUES: Record<string, string> = {
    "computer-studies": "/colleges/computer-studies.webp",
    // Add more colleges as needed
}

type CollegePageProps = {
    params: Promise<{
        "college-name": string
    }>
}

export default function CollegePage({ params }: CollegePageProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, amount: 0.2 })

    const resolvedParams = use(params)
    const collegeName = resolvedParams["college-name"]
    const statueImage = COLLEGE_STATUES[collegeName] || COLLEGE_STATUES["computer-studies"]
    const collegeInfo = COLLEGE_DATA[collegeName] || COLLEGE_DATA["computer-studies"]

    return (
        <main className="relative h-screen w-full overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    src="/colleges/college-bg.webp"
                    alt="College Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 z-10"></div>
            </div>

            {/* Content Grid */}
            <div
                ref={containerRef}
                className="relative z-20 h-full w-full px-4 container mx-auto"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center mx-auto">
                    {/* Left Side - Title, Description, and Link */}
                    <CollegeDetails
                        collegeName={collegeName}
                    />

                    {/* Right Side - Statue Image */}
                    <motion.div
                        className="relative w-full h-full flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.95, x: 50 }}
                        animate={isInView ? {
                            opacity: 1,
                            scale: 1,
                            x: 0
                        } : { opacity: 0, scale: 0.95, x: 50 }}
                        transition={{
                            duration: 1.2,
                            ease: [0.22, 1, 0.36, 1],
                            delay: 0.5
                        }}
                    >
                        <motion.div
                            className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{
                                duration: 1.5,
                                delay: 0.7
                            }}
                        >
                            <Image
                                src={statueImage}
                                alt={collegeInfo.title}
                                width={500}
                                height={500}
                                className="object-contain w-full h-auto mx-auto 2xl:mt-20 xl:mt-16 lg:mt-12 md:mt-8 sm:mt-4 ml-20 mt-2"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Go Back Button */}
            <GoBackButton
                isVisible={true}
                onClose={() => {
                    window.location.href = '/'
                }}
            />
        </main>
    )
}

'use client';

import { SceneContainer } from "@/components/scene-container";
import { WelcomeSection, HeroSection, AboutSection } from "@/components/sections";
import { NavigationDots } from "@/components/navigation-dots";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function Home() {
    const { mainRef, sceneRef, progress, currentSection, scrollToSection } = useScrollAnimation();

    return (
        <>
            <SceneContainer progress={progress} sceneRef={sceneRef} />

            <NavigationDots
                totalSections={3}
                currentSection={currentSection}
                onSectionClick={scrollToSection}
            />

            <main ref={mainRef} className="relative z-10">
                <WelcomeSection />
                <HeroSection />
                <AboutSection />
            </main>
        </>
    );
}
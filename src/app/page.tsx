'use client';

import { SceneContainer } from '@/components/scene-container';
import { WelcomeSection, PresidentMessageSection, ValedictorianMessageSection } from '@/components/sections';
import { NavigationDots } from '@/components/navigation-dots';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Navbar } from '@/components/layout/nav';

export default function Home() {
  const { mainRef, sceneRef, progress, currentSection, scrollToSection } = useScrollAnimation();

  return (
    <>
      <Navbar />

      <SceneContainer progress={progress} sceneRef={sceneRef} />

      <NavigationDots totalSections={3} currentSection={currentSection} onSectionClick={scrollToSection} />

      <main ref={mainRef} className='relative z-10 pt-20'>
        <WelcomeSection />
        <PresidentMessageSection />
        <ValedictorianMessageSection />
      </main>
    </>
  );
}

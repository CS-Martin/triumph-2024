export function WelcomeSection() {
    return (
        <section className="h-screen pointer-events-none" />
    );
}

export function HeroSection() {
    return (
        <section className="h-screen flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-8 text-center">
                <h1 className="text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                    Welcome to Triumph 2024
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                    Experience an extraordinary journey through innovation, creativity, and achievement.
                </p>
            </div>
        </section>
    );
}

export function AboutSection() {
    return (
        <section className="h-screen flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-8">
                <h2 className="text-5xl font-bold text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                    About the Event
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                        <h3 className="text-2xl font-semibold text-[#c8a44a] mb-4">Innovation</h3>
                        <p className="text-gray-200">Discover cutting-edge technologies and groundbreaking ideas.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                        <h3 className="text-2xl font-semibold text-[#c8a44a] mb-4">Excellence</h3>
                        <p className="text-gray-200">Celebrate outstanding achievements and recognize those who push limits.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

import React from 'react';
import NeonGradientCard from './magicui/NeonGradientCard ';

function Features() {
    const features = [
        {
            title: "Crystal Clear Audio",
            description: "Experience high-fidelity sound that makes you feel like you're in the same room.",
            icon: "🎧"
        },
        {
            title: "HD Video",
            description: "Crisp, lag-free video that brings your team closer together.",
            icon: "🎥"
        },
        {
            title: "In-Call Messages",
            description: "Stay connected with real-time chat during your calls, allowing seamless communication and collaboration.",
            icon: "💬"
        }
    ];

    return (
        <section className="py-20 px-8 bg-black min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto w-full">
                <h2
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="text-4xl font-bold text-center text-gray-100 mb-16"
                >
                    Why Choose NEXUS?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {features.map((feature, index) => (
                        <NeonGradientCard key={index}>
                            <div className="space-y-4">
                                <span className="text-5xl block" role="img" aria-label={feature.title}>
                                    {feature.icon}
                                </span>
                                <h3 className="text-xl font-semibold text-cyan-400">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300">
                                    {feature.description}
                                </p>
                            </div>
                        </NeonGradientCard>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;
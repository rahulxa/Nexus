import React from 'react'
import NeonGradientCard from './magicui/NeonGradientCard ';

function Features() {

    const features = [
        { title: "Crystal Clear Audio", description: "Experience high-fidelity sound that makes you feel like you're in the same room." },
        { title: "HD Video", description: "Crisp, lag-free video that brings your team closer together." },
        { title: "Secure Meetings", description: "End-to-end encryption ensures your conversations stay private." }
    ];

    return (
        <section className="py-20 px-8 bg-black bg-opacity-60">
            <h2 className="text-4xl font-bold text-center text-gray-100 mb-12">Why Choose NEXUS?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <NeonGradientCard
                        key={index}
                        className="h-full"
                        borderSize={1.5}
                        borderRadius={18}
                        neonColors={{
                            firstColor: "rgba(0, 255, 241, 0.7)",
                            secondColor: "rgba(0, 170, 255, 0.7)"
                        }}
                        glowOpacity={0.6}
                        blurAmount={15}
                    >
                        <div className="h-full bg-gray-900 bg-opacity-80 p-6 rounded-[16.5px]">
                            <h3 className="text-xl font-semibold text-cyan-400 mb-2">{feature.title}</h3>
                            <p className="text-gray-300">{feature.description}</p>
                        </div>
                    </NeonGradientCard>
                ))}
            </div>
        </section>
    )
}

export default Features
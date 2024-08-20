import React from 'react';
import { ArrowRightIcon } from "@radix-ui/react-icons";
import ShinyButton from '../components/magicui/ShinyButton';
import WordRotate from '../components/magicui/WordRotate';
import NeonGradientCard from '../components/magicui/NeonGradientCard ';

function Landing() {
    const words = ["Connect", "Communicate", "Collaborate"]

    const features = [
        { title: "Crystal Clear Audio", description: "Experience high-fidelity sound that makes you feel like you're in the same room." },
        { title: "HD Video", description: "Crisp, lag-free video that brings your team closer together." },
        { title: "Secure Meetings", description: "End-to-end encryption ensures your conversations stay private." }
    ];

    return (
        <div className="min-h-screen bg-black">
            <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(back2.jpg)' }}>
                <div className="backdrop-blur-sm bg-black bg-opacity-25 min-h-screen">
                    {/* Hero Section */}
                    <div className='relative z-10 flex flex-col min-h-screen'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <img src='MyLogo.png' className='h-24 w-auto' alt="Logo" />
                                <ShinyButton text="Join as Guest" className="ml-2">
                                    <ArrowRightIcon className="size-3 ml-1 mt-1 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                                </ShinyButton>
                            </div>
                            <div className='flex items-center space-x-4 mr-6'>
                                <ShinyButton text="Register" />
                                <ShinyButton text="Login" className="font-semibold" />
                            </div>
                        </div>
                        <div className='flex-grow flex items-center justify-between px-8'>
                            <div className='w-1/2'>
                                <h1 className="text-gray-200 text-6xl font-bold font-playfair">Introducing <span className="text-[rgb(0,200,200)]">NEXUS</span></h1>
                                <WordRotate
                                    words={words}
                                    className="text-6xl font-poppins bg-clip-text text-transparent bg-gradient-to-r from-[#00C8C8] to-[#008080]"
                                />
                                <h1 className="text-gray-200 text-2xl font-poppins mt-4">Bringing people together wherever they are.</h1>
                            </div>
                            <div className='w-1/2 flex flex-col items-center mt-10'>
                                <div className="relative w-96 h-64 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 opacity-75"></div>
                                    <div className="absolute inset-1 bg-gray-900 rounded-lg flex items-center justify-center">
                                        <img
                                            src="nexusFrame.jpg"
                                            alt="NEXUS Call"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="mt-8 text-gray-200">
                                    <ul className="space-y-2">
                                        <li className="flex items-center">
                                            <svg className="w-6 h-6 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            HD Video & Audio
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-6 h-6 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            Screen Sharing
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-6 h-6 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            End-to-End Encryption
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
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

                    {/* About Section */}
                    <section className="py-20 px-8 bg-black bg-opacity-70">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl font-bold text-gray-100 mb-6">About NEXUS</h2>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                NEXUS is more than just a video conferencing tool. It's a platform designed to foster genuine connections in a digital world. Our mission is to break down the barriers of distance and bring teams together, no matter where they are.
                            </p>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="bg-black bg-opacity-80 text-gray-300 py-8">
                        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-between items-center">
                            <div className="w-full md:w-1/3 text-center md:text-left mb-6 md:mb-0">
                                <img src='MyLogo.png' className='h-16 w-auto mx-auto md:mx-0' alt="Logo" />
                            </div>
                            <div className="w-full md:w-1/3 text-center mb-6 md:mb-0">
                                <p>&copy; 2024 NEXUS. All rights reserved.</p>
                            </div>
                            <div className="w-full md:w-1/3 text-center md:text-right">
                                <a href="#" className="text-cyan-400 hover:text-cyan-300 mx-2">Terms</a>
                                <a href="#" className="text-cyan-400 hover:text-cyan-300 mx-2">Privacy</a>
                                <a href="#" className="text-cyan-400 hover:text-cyan-300 mx-2">Contact</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default Landing;
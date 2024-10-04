import React, { useRef } from 'react';
import WordRotate from './magicui/WordRotate';
import { AnimatedBeam } from './magicui/AnimatedBeam';
import { FaVideo, FaDesktop, FaComments, FaMicrophone } from 'react-icons/fa'; // Video camera icon

function Hero() {
    const words = ["Connect", "Communicate", "Collaborate"];
    const containerRef = useRef(null);
    const nexusLogoRef = useRef(null);
    const icon1Ref = useRef(null);
    const icon2Ref = useRef(null);

    const icon3Ref = useRef(null);
    const icon4Ref = useRef(null);

    return (
        <div className='relative z-10 flex flex-col min-h-screen bg-black text-gray-200 -mt-10'>
            <div className='flex flex-col items-center justify-center flex-1 px-8 mt-14'>
                <h1 className="text-7xl font-bold font-poppins text-center">
                    Introducing
                    <span className="inline-block ml-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                        NEXUS
                    </span>
                </h1>

                <div className="mt-4">
                    <WordRotate
                        words={words}
                        className="text-7xl font-poppins bg-clip-text text-transparent bg-gradient-to-r from-[#00C8C8] to-[#008080]"
                    />
                </div>

                <h2 className="text-4xl font-roboto mt-4 text-center">Bringing people together wherever they are.</h2>
                <div className='flex '>
                    <p>Redefining virtual meetings.
                        connect with ease, share with confidence,
                        and experience communication like never before.</p>
                </div>
                <button className="bg-cyan-800 hover:bg-cyan-900 duration-300 ease-in-out text-gray-200 mt-16 font-md py-2 px-4 rounded-md shadow-md">
                    Get Started
                </button>

                <div className="text-center flex justify-center space-x-24 mt-16 ml-10"> {/* Increased space-x */}
                    <ul className="flex items-center space-x-10">
                        <li className="flex items-center text-lg font-semibold text-gray-400 glow-effect">
                            HD Video & Audio
                        </li>
                    </ul>

                    <ul className="flex items-center space-x-10">
                        <li className="flex items-center text-lg font-semibold text-gray-400 glow-effect">
                            Screen Sharing
                        </li>
                    </ul>

                    <ul className="flex items-center space-x-10">
                        <li className="flex items-center text-lg font-semibold text-gray-400 glow-effect">
                            End-to-End Encryption
                        </li>
                    </ul>
                </div>


                <div ref={containerRef} className='w-1/2 flex flex-col items-center relative' style={{ height: '400px' }}>
                    {/* Nexus Logo */}
                    <div ref={nexusLogoRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <img src="MyLogo.png" alt="Nexus Logo" width="150" height="150" /> {/* Make this bigger */}
                    </div>

                    {/* Left Icons */}
                    <div>
                        <div ref={icon1Ref} className="absolute top-1/4 left-0">
                            <FaVideo size={40} color="#00BFFF" />
                        </div>
                        <div ref={icon2Ref} className="absolute bottom-1/4 left-0">
                            <FaDesktop size={40} color="#00BFFF" />
                        </div>

                        {/* Right Icons */}
                        <div ref={icon3Ref} className="absolute top-1/4 right-0">
                            <FaComments size={40} color="#00BFFF" />
                        </div>
                        <div ref={icon4Ref} className="absolute bottom-1/4 right-0">
                            <FaMicrophone size={40} color="#00BFFF" />
                        </div>
                    </div>

                    {/* Animated Beams */}
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={nexusLogoRef}
                        toRef={icon1Ref}
                        gradientStartColor="#00C8C8"
                        gradientStopColor="#008080"
                        pathColor="#00C8C8"
                        curvature={-30}
                    />
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={nexusLogoRef}
                        toRef={icon2Ref}
                        gradientStartColor="#00C8C8"
                        gradientStopColor="#008080"
                        pathColor="#00C8C8"
                        curvature={30}
                    />
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={nexusLogoRef}
                        toRef={icon3Ref}
                        gradientStartColor="#00C8C8"
                        gradientStopColor="#008080"
                        pathColor="#00C8C8"
                        curvature={-30}
                    />
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={nexusLogoRef}
                        toRef={icon4Ref}
                        gradientStartColor="#00C8C8"
                        gradientStopColor="#008080"
                        pathColor="#00C8C8"
                        curvature={30}
                    />
                </div>
            </div>
        </div>
    );
}

export default Hero;

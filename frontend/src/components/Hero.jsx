import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import WordRotate from './magicui/WordRotate';
import { AnimatedBeam } from './magicui/AnimatedBeam';
import { FaVideo, FaDesktop, FaComments, FaMicrophone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Hero() {
    const words = ["Connect", "Communicate", "Collaborate"];
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const nexusLogoRef = useRef(null);
    const icon1Ref = useRef(null);
    const icon2Ref = useRef(null);
    const icon3Ref = useRef(null);
    const icon4Ref = useRef(null);

    const controls = useAnimation();

    useEffect(() => {
        controls.start(i => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2, duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
        }));
    }, [controls]);

    const handleButtonClick = () => {
        navigate("/authentication");
    }

    return (
        <div className='relative z-10 flex flex-col min-h-screen bg-black text-gray-200 -mt-10'>
            <div className='flex flex-col items-center justify-center flex-1 px-8 mt-16'>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    custom={0}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="text-7xl font-bold font-poppins text-center"
                >
                    Introducing
                    <span className="inline-block ml-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                        NEXUS
                    </span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    custom={1}
                    className="mt-3"
                >
                    <WordRotate
                        words={words}
                        className="text-7xl font-poppins bg-clip-text text-transparent bg-gradient-to-r from-[#00C8C8] to-[#008080]"
                    />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    custom={2}
                    className="text-4xl font-roboto mt-4 text-center"
                >
                    Bringing people together wherever they are.
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    custom={3}
                    className="flex justify-between w-full mt-4"
                >
                    <div></div>
                    <div className="w-1/3 text-sm text-right mr-9" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <p>Redefining virtual meetings</p>
                        <p style={{ marginRight: "-18px" }}>
                            <i className='text-cyan-400'>connect with ease,</i> share with,
                        </p>
                        <p style={{ marginRight: "1px" }}>confidence and experience </p>
                        <p style={{ marginRight: "11px" }}>
                            <i className='text-cyan-400'>communication</i> like never
                        </p>
                        <p style={{ marginRight: "144px" }}>before.</p>
                    </div>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    custom={4}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleButtonClick}
                    className="bg-cyan-600 hover:bg-cyan-800 duration-300 -mt-9 ease-in-out text-gray-200 font-semibold py-2 px-8 rounded-md shadow-md"
                >
                    Get Started
                </motion.button>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="text-center flex justify-center space-x-24 mt-28 ml-10"
                >
                    {['HD Video & Audio', 'Screen Sharing', 'End-to-End Encryption'].map((feature, index) => (
                        <motion.div
                            key={feature}
                            initial={{ opacity: 0, y: 20 }}
                            animate={controls}
                            custom={index + 5}
                        >
                            <p style={{ fontFamily: 'Poppins, sans-serif' }} className="flex items-center text-lg font-md text-cyan-500 glow-effect">
                                {feature}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* animated beam */}
                <div ref={containerRef} className='w-1/2 flex mt-6 flex-col items-center relative' style={{ height: '400px' }}>
                    {/* Nexus Logo */}
                    <div ref={nexusLogoRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-1">
                        <img src="MyLogo.png" alt="Nexus Logo" width="170" height="170" /> {/* Make this bigger */}
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
                        curvature={-5}
                    />
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={nexusLogoRef}
                        toRef={icon2Ref}
                        gradientStartColor="#00C8C8"
                        gradientStopColor="#008080"
                        pathColor="#00C8C8"
                        curvature={5}
                    />
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={nexusLogoRef}
                        toRef={icon3Ref}
                        gradientStartColor="#00C8C8"
                        gradientStopColor="#008080"
                        pathColor="#00C8C8"
                        curvature={-5}
                    />
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={nexusLogoRef}
                        toRef={icon4Ref}
                        gradientStartColor="#00C8C8"
                        gradientStopColor="#008080"
                        pathColor="#00C8C8"
                        curvature={5}
                    />
                </div>
            </div>
        </div>
    );
}

export default Hero;
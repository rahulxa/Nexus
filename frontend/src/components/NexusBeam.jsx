import React, { useRef, useEffect, useState } from 'react';
import { AnimatedBeam } from './magicui/AnimatedBeam';

const NexusBeamComponent = () => {
    const containerRef = useRef(null);
    const nexusLogoRef = useRef(null);
    const videoCallIconRef = useRef(null);
    const screenShareIconRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-gray-100 flex items-center justify-center">
            {/* Nexus Logo */}
            <div ref={nexusLogoRef} className="absolute">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" stroke="#4A90E2" strokeWidth="10" />
                    <path d="M30 50L50 30L70 50L50 70L30 50Z" fill="#4A90E2" />
                </svg>
            </div>

            {/* Video Call Icon */}
            <div ref={videoCallIconRef} className="absolute top-1/4 right-1/4">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 10L19.553 7.724C20.449 7.276 21.5 7.925 21.5 8.929V15.071C21.5 16.075 20.449 16.724 19.553 16.276L15 14" stroke="#4A90E2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="2.5" y="6.5" width="15" height="11" rx="2.5" stroke="#4A90E2" strokeWidth="1.5" />
                </svg>
            </div>

            {/* Screen Share Icon */}
            <div ref={screenShareIconRef} className="absolute bottom-1/4 left-1/4">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="14" rx="2" stroke="#4A90E2" strokeWidth="1.5" />
                    <path d="M8 21H16" stroke="#4A90E2" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 14V21" stroke="#4A90E2" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>

            {/* Animated Beams */}
            {mounted && (
                <>
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={nexusLogoRef}
                        toRef={videoCallIconRef}
                        gradientStartColor="#4A90E2"
                        gradientStopColor="#82E0AA"
                        pathColor="#4A90E2"
                        curvature={50}
                    />
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={nexusLogoRef}
                        toRef={screenShareIconRef}
                        gradientStartColor="#4A90E2"
                        gradientStopColor="#F1948A"
                        pathColor="#4A90E2"
                        curvature={-50}
                    />
                </>
            )}
        </div>
    );
};

export default NexusBeamComponent;
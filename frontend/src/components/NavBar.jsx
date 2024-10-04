import React, { useState, useEffect } from 'react'
import ShinyButton from './magicui/ShinyButton'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { Link } from "react-router-dom"

function NavBar() {
    const [showNav, setShowNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const controlNavBar = () => {
        if (typeof window !== 'undefined') {
            if (window.scrollY > lastScrollY) {
                // If scroll down, hide navbar
                setShowNav(false);
            } else {
                // If scroll up, show navbar
                setShowNav(true);
            }
            setLastScrollY(window.scrollY); // Update last scroll position
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavBar);

            return () => {
                window.removeEventListener('scroll', controlNavBar);
            };
        }
    }, [lastScrollY]);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-md transition-transform duration-300 ease-in-out ${showNav ? 'translate-y-0' : '-translate-y-full'
                }`}
        >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-20'>
                    <div className='flex items-center'>
                        <Link to="/">
                            <img src='MyLogo.png' className='h-20 w-auto' alt="Logo" />
                        </Link>
                    </div>
                    <div className='flex items-center space-x-4'>
                        <Link to="/Join-as guest">
                            <ShinyButton text="Join as Guest" className="ml-2">
                                <ArrowRightIcon className="size-3 ml-1 mt-1 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                            </ShinyButton>
                        </Link>
                        <Link to="/authentication">
                            <ShinyButton text="Sign In" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;

import React from 'react';
import { ArrowRightIcon } from "@radix-ui/react-icons";
import ShinyButton from '../components/magicui/ShinyButton';

function Landing() {
    return (
        <>
            <div className="relative min-h-screen">
                <img src='background.jpg' className='absolute inset-0 w-full h-full object-cover' alt="Background" />
                <div className='relative z-10 flex items-center justify-between'>
                    <div className='flex items-center'>
                        <img src='MyLogo.png' className='h-24 w-auto' alt="Logo" />
                    </div>

                    <div className='flex items-center space-x-4 ml-auto mr-8'>
                        <ShinyButton text="Join as Guest">
                            <ArrowRightIcon className="size-3 ml-1 mt-1 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                        </ShinyButton>

                        <ShinyButton text="Register" />

                        <ShinyButton text="Login" className="font-semibold" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Landing;

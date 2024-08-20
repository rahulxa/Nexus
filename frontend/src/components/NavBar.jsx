import React from 'react'
import ShinyButton from './magicui/ShinyButton'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { Link } from "react-router-dom"

function NavBar() {
    return (
        <nav className='fixed top-0 left-0 right-0 z-50 bg-opacity-100 backdrop-blur-sm'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-20'>
                    <div className='flex items-center'>
                        <Link to="/">
                            <img src='MyLogo.png' className='h-16 w-auto' alt="Logo" />
                        </Link>
                        <Link to="/Join as guest">
                            <ShinyButton text="Join as Guest" className="ml-2">
                                <ArrowRightIcon className="size-3 ml-1 mt-1 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                            </ShinyButton>
                        </Link>
                    </div>
                    <div className='flex items-center space-x-4'>
                        <Link to="/register">
                            <ShinyButton text="Register" />
                        </Link>
                        <Link to="/login">
                            <ShinyButton text="Login" className="font-semibold" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
import React from 'react'

function Footer() {
    return (
        <footer className=" bottom-0 left-0 right-0 bg-black bg-opacity-100 text-gray-300 py-8">
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
    )
}

export default Footer
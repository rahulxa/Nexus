import React from 'react'
import WordRotate from './magicui/WordRotate'

function Hero() {
    const words = ["Connect", "Communicate", "Collaborate"]

    return (
        <div className='relative z-10 flex flex-col min-h-screen'>

            <div className='flex-grow flex items-center justify-between px-8'>
                <div className='w-1/2 mb-28 '>
                    <h1 className="text-gray-200 text-6xl font-bold font-playfair">
                        Introducing{" "}
                        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                            NEXUS
                        </span>
                    </h1>
                    <WordRotate
                        words={words}
                        className="text-6xl font-poppins bg-clip-text text-transparent bg-gradient-to-r from-[#00C8C8] to-[#008080]"
                    />
                    <h1 className="text-gray-200 text-2xl font-poppins mt-4">Bringing people together wherever they are.</h1>
                </div>
                <div className='w-1/2 flex flex-col items-center'>
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
    )
}

export default Hero
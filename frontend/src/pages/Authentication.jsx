import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import GradualSpacing from '../components/magicui/GradualSpacing';

const Authentication = () => {

    const [signup, setSignup] = useState(true)
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleLoginSignup = () => {
        setSignup(prev => !prev);
    }

    const registerOrLoginUser = (e) => {
        e.preventDefault()
        setSignup(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed relative"
            style={{ backgroundImage: 'url(back2.jpg)' }}>

            <div className="absolute inset-0 bg-black opacity-50 backdrop-filter backdrop-blur-md"></div>

            <div className="w-96 bg-gray-900 bg-opacity-80 rounded-lg p-8 shadow-lg border border-cyan-400 relative z-10 mt-20">
                {signup === true ? (
                    <GradualSpacing className="text-3xl font-bold text-center mb-6 text-white">
                        <span className="mr-1">Join</span>
                        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">NEXUS</span>
                        <span className="ml-1">Today</span>
                    </GradualSpacing>
                ) : (
                    <GradualSpacing className="text-3xl font-bold text-center mb-6 text-white">
                        <span className="mr-1">Login to</span>
                        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">NEXUS</span>
                    </GradualSpacing>
                )}
                <form className="space-y-6">
                    <div>
                        <input
                            className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 border border-cyan-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                            type="text"
                            placeholder="Username"
                            autoComplete="off"
                        />
                    </div>
                    {signup && (
                        <div>
                            <input
                                className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 border border-cyan-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                                type="text"
                                placeholder="email"
                                autoComplete="off"
                            />
                        </div>
                    )}
                    <div className="relative">
                        <input
                            className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 border border-cyan-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            autoComplete="off"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 focus:outline-none"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        onClick={(e) => registerOrLoginUser(e)}
                        className="w-full p-3 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-800 transition duration-300"
                    >
                        {signup === true ? "Register" : "Login"}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <span className="text-gray-300">{signup === true ? "Already have an account?" : "Don't have an account?"}</span>
                    <button className='text-cyan-400 hover:underline ml-1'
                        onClick={toggleLoginSignup}
                    >{signup === true ? "Login" : "Signup"}</button>
                </div>
            </div>
        </div>
    );
};

export default Authentication;
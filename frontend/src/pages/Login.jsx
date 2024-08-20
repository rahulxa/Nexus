import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import GradualSpacing from '../components/magicui/GradualSpacing';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed relative"
            style={{ backgroundImage: 'url(back2.jpg)' }}>
            {/* Blurred overlay */}
            <div className="absolute inset-0 bg-black opacity-50 backdrop-filter backdrop-blur-md"></div>

            {/* Login component */}
            <div className="w-96 bg-gray-900 bg-opacity-80 rounded-lg p-8 shadow-lg border border-cyan-400 relative z-10 mt-20">
                <GradualSpacing className="text-3xl font-bold text-center mb-6 text-white">
                    <span>Login to </span>
                    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">NEXUS</span>
                </GradualSpacing>
                <form className="space-y-6">
                    <div>
                        <input
                            className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 border border-cyan-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                            type="text"
                            placeholder="Username"
                        />
                    </div>
                    <div className="relative">
                        <input
                            className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 border border-cyan-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"

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
                        className="w-full p-3 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-800 transition duration-300"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <a href="#" className="text-sm text-cyan-400 hover:underline">Forgot Password?</a>
                </div>
                <div className="mt-6 text-center">
                    <span className="text-gray-300">Don't have an account? </span>
                    <a href="#" className="text-cyan-400 hover:underline">Sign up</a>
                </div>
            </div>
        </div>
    );
};

export default Login;

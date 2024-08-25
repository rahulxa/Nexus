import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import GradualSpacing from '../components/magicui/GradualSpacing';
import axios from "axios";
import httpStatus from "http-status";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
    axios.defaults.withCredentials = true;
    const [signup, setSignup] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleLoginSignup = () => {
        setSignup(prev => !prev);
        setMessage({ type: '', content: '' });
    };

    const loginUser = async (username, password) => {
        try {
            const userDetails = { username, password }
            const loggedInUser = await axios.post("http://localhost:8080/api/v1/users/login", userDetails);
            if (loggedInUser.status === httpStatus.OK) {
                console.log("logged in")
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage({ type: 'error', content: error.response.data.message });
            } else {
                setMessage({ type: 'error', content: 'An unexpected error occurred. Please try again.' });
            }
        }
    }

    const registerUser = async (e) => {
        e.preventDefault();
        setMessage({ type: '', content: '' });
        try {
            const userDetails = { username, email, password };
            const response = await axios.post("http://localhost:8080/api/v1/users/register", userDetails);

            if (response.status === httpStatus.CREATED) {
                setSignup(false);
                setMessage({ type: 'success', content: response.data.message });
                loginUser(username, password)
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage({ type: 'error', content: error.response.data.message });
            } else {
                setMessage({ type: 'error', content: 'An unexpected error occurred. Please try again.' });
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed relative"
            style={{ backgroundImage: 'url(back2.jpg)' }}>
            <div className="absolute inset-0 bg-black opacity-50 backdrop-filter backdrop-blur-md"></div>
            <div className="w-96 bg-gray-900 bg-opacity-80 rounded-lg p-8 shadow-lg border border-cyan-400 relative z-10 mt-20">
                <GradualSpacing
                    className="text-3xl font-bold text-center mb-6 text-white"
                    key={signup ? 'signup' : 'login'} // Add this line
                >
                    <span className="mr-1">{signup ? 'Join' : 'Login to'}</span>
                    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">NEXUS</span>
                    {signup && <span className="ml-1">Today</span>}
                </GradualSpacing>

                {message.content && (
                    <div className={`
                    mb-4 p-3 rounded-md border 
                    ${message.type === 'error'
                            ? 'bg-red-900 bg-opacity-20 border-red-500 text-red-200'
                            : 'bg-green-900 bg-opacity-20 border-green-500 text-green-200'
                        } 
                    transition-all duration-300 ease-in-out
                `}>
                        <div className='flex flex-row'>
                            <p className="text-sm">
                                {message.type === 'error' ? '⚠️ ' : '✅ '}
                            </p>
                            <p className='text-sm font-medium ml-1'>
                                {message.content}
                            </p>
                        </div>
                    </div>
                )}

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <input
                            className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 border border-cyan-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                            type="text"
                            placeholder="Username"
                            autoComplete="off"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    {signup && (
                        <div>
                            <input
                                className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 border border-cyan-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                                type="text"
                                placeholder="Email"
                                autoComplete="off"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="relative">
                        <input
                            className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 border border-cyan-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            autoComplete="off"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        onClick={(e) => signup ? registerUser(e) : loginUser(username, password)}
                        className="w-full p-3 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-800 transition duration-300"
                    >
                        {signup ? "Register" : "Login"}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <span className="text-gray-300">{signup ? "Already have an account?" : "Don't have an account?"}</span>
                    <button className='text-cyan-400 hover:underline ml-1' onClick={toggleLoginSignup}>
                        {signup ? "Login" : "Signup"}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default Authentication;
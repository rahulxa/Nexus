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
    const [justRegistered, setJustRegistered] = useState(false);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleLoginSignup = () => {
        setSignup(prev => !prev);
        setMessage({ type: '', content: '' });
        if (!justRegistered) {
            setUsername("");
            setPassword("");
        }
        setEmail("");
        setJustRegistered(false);
    };

    const loginUser = async (username, password) => {
        try {
            const userDetails = { username, password }
            const loggedInUser = await axios.post("http://localhost:8080/api/v1/users/login", userDetails);
            if (loggedInUser.status === httpStatus.OK) {
                localStorage.setItem("username", loggedInUser.data.data.username);
                console.log("logged in")
                navigate("/home")
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
                setMessage({ type: 'success', content: 'Registration successful. Please log in.' });
                setJustRegistered(true);
                setEmail("");
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
        <div className="h-screen  bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex flex-col items-center justify-center relative">
            {/* Optional Decorative Background */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-700 rounded-full opacity-20 filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full opacity-20 filter blur-3xl"></div>

            {/* Login/Signup Box */}
            <div className="w-96 mt-20 bg-gray-900 bg-opacity-80 rounded-lg p-8 shadow-lg border border-cyan-400 relative z-10">
                <GradualSpacing
                    className="text-3xl font-bold text-center mb-6 text-white"
                    key={signup ? 'signup' : 'login'}
                >
                    <span className="mr-1">{signup ? 'Join' : 'Login to'}</span>
                    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">NEXUS</span>
                    {signup && <span className="ml-1">Today</span>}
                </GradualSpacing>

                {/* Message Notification */}
                {message.content && (
                    <div className={`
        mb-4 p-3 rounded-md border 
        ${message.type === 'error'
                            ? 'bg-red-900 bg-opacity-20 border-red-500 text-red-200'
                            : 'bg-green-900 bg-opacity-20 border-green-500 text-green-200'
                        } 
        transition-all duration-300 ease-in-out
    `}>
                        <div className='flex flex-row items-center'>
                            <p>{message.type === 'error' ? '⚠️ ' : '✅ '}</p>
                            <p className='ml-2 text-sm'>{message.content}</p>
                        </div>
                    </div>
                )}

                {/* Form Fields */}
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <input
                        className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 border border-cyan-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                        type="text"
                        placeholder="Username"
                        autoComplete="off"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {signup && (
                        <input
                            className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 border border-cyan-400 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
                            type="text"
                            placeholder="Email"
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
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
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        onClick={(e) => {
                            if (signup) {
                                registerUser(e);
                            } else {
                                loginUser(username, password);
                                setJustRegistered(false);
                            }
                        }}
                        className="w-full p-3 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-800 transition duration-300"
                    >
                        {signup ? "Register" : (justRegistered ? "Complete Login" : "Login")}
                    </button>
                </form>

                {/* Toggle Signup/Login */}
                <div className="mt-6 text-center">
                    <span className="text-gray-300">{signup ? "Already have an account?" : "Don't have an account?"}</span>
                    <button className='text-cyan-400 hover:underline ml-1' onClick={toggleLoginSignup}>
                        {signup ? "Login" : "Signup"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Authentication;
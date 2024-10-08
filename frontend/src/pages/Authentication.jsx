import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import GradualSpacing from '../components/magicui/GradualSpacing';
import axios from "axios";
import httpStatus from "http-status";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

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

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        },
        exit: { opacity: 0, y: -50, transition: { ease: "easeInOut" } }
    };

    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
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
        <div className="h-screen bg-black p-4 flex flex-col items-center justify-center relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={signup ? 'signup' : 'signin'}
                    className={`w-96 bg-black rounded-lg p-8 shadow-lg relative z-10 ${signup ? "mt-28" : "mt-24"}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <motion.h1 variants={childVariants} className="text-4xl font-semibold text-white mb-2">
                        {!signup ? "Sign in" : "Sign up"}
                    </motion.h1>
                    {!signup && (
                        <motion.p variants={childVariants} className="text-gray-400 mb-6">
                            New user? <a href="#" className="text-cyan-500" onClick={toggleLoginSignup}>Create an account</a>
                        </motion.p>
                    )}

                    {/* Message Notification */}
                    <AnimatePresence>
                        {message.content && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`
                                    mb-4 p-3 rounded-md 
                                    ${message.type === 'error'
                                        ? 'bg-red-900 bg-opacity-20 text-red-200'
                                        : 'bg-green-900 bg-opacity-20 text-green-200'
                                    } 
                                    transition-all duration-300 ease-in-out
                                `}
                            >
                                <div className='flex flex-row items-center'>
                                    <p>{message.type === 'error' ? '⚠️ ' : '✅ '}</p>
                                    <p className='ml-2 text-sm'>{message.content}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form Fields */}
                    <motion.form variants={childVariants} className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        {signup && (
                            <motion.input
                                variants={childVariants}
                                className="w-full p-3 bg-black text-white placeholder-gray-400 border-b border-gray-600 focus:outline-none focus:border-gray-300 transition duration-300"
                                type="text"
                                placeholder="Username"
                                autoComplete="off"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        )}
                        <motion.input
                            variants={childVariants}
                            className="w-full p-3 bg-black text-white placeholder-gray-400 border-b border-gray-600 focus:outline-none focus:border-gray-300 transition duration-300"
                            type="text"
                            placeholder="Email address"
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <motion.div variants={childVariants} className="relative">
                            <input
                                className="w-full p-3 bg-black text-white placeholder-gray-400 border-b border-gray-600 focus:outline-none focus:border-gray-300 transition duration-300"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                autoComplete="off"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </motion.div>
                        <motion.button
                            variants={childVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            onClick={(e) => {
                                if (signup) {
                                    registerUser(e);
                                } else {
                                    loginUser(username, password);
                                    setJustRegistered(false);
                                }
                            }}
                            className="w-full p-3 bg-cyan-600 text-black font-semibold rounded-full hover:bg-cyan-700 transition duration-300 mt-6"
                        >
                            Continue
                        </motion.button>
                    </motion.form>

                    <motion.div variants={childVariants} className="mt-6 text-center">
                        <p className="text-gray-500">Or</p>
                    </motion.div>

                    <button className="w-full mt-4 p-3 bg-black text-white font-md rounded-full border border-gray-600 hover:bg-gray-900 transition duration-300 flex items-center justify-center">
                        <svg width="23" height="23" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-4 ">
                            <path d="M17.4612 7.21757H16.751V7.18098H8.81632V10.7075H13.7989C13.072 12.7604 11.1187 14.234 8.81632 14.234C5.89503 14.234 3.52653 11.8655 3.52653 8.94425C3.52653 6.02296 5.89503 3.65446 8.81632 3.65446C10.1648 3.65446 11.3916 4.16316 12.3257 4.9941L14.8194 2.5004C13.2448 1.03292 11.1385 0.12793 8.81632 0.12793C3.94751 0.12793 0 4.07544 0 8.94425C0 13.8131 3.94751 17.7606 8.81632 17.7606C13.6851 17.7606 17.6326 13.8131 17.6326 8.94425C17.6326 8.35311 17.5718 7.77609 17.4612 7.21757Z" fill="#FFC107" />
                            <path d="M1.0166 4.84069L3.9132 6.96498C4.69697 5.02451 6.59513 3.65446 8.8164 3.65446C10.1649 3.65446 11.3916 4.16316 12.3257 4.9941L14.8194 2.5004C13.2448 1.03292 11.1386 0.12793 8.8164 0.12793C5.43005 0.12793 2.49333 2.03975 1.0166 4.84069Z" fill="#FF3D00" />
                            <path d="M8.8165 17.7612C11.0938 17.7612 13.1629 16.8897 14.7274 15.4725L11.9988 13.1635C11.0839 13.8593 9.96591 14.2356 8.8165 14.2347C6.52338 14.2347 4.57629 12.7725 3.84278 10.7319L0.967773 12.947C2.42687 15.8022 5.39004 17.7612 8.8165 17.7612Z" fill="#4CAF50" />
                            <path d="M17.4612 7.21823H16.7511V7.18164H8.81641V10.7082H13.7989C13.4512 11.6852 12.8249 12.539 11.9973 13.164L11.9987 13.1631L14.7273 15.4721C14.5342 15.6475 17.6327 13.3531 17.6327 8.9449C17.6327 8.35377 17.5719 7.77674 17.4612 7.21823Z" fill="#1976D2" />
                        </svg>
                        Continue with Google
                    </button>

                    {signup && (
                        <motion.div variants={childVariants} className="mt-6 text-center">
                            <span className="text-gray-400">Already have an account?</span>
                            <button className='text-cyan-500 hover:underline ml-1' onClick={toggleLoginSignup}>
                                Sign In
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Authentication;
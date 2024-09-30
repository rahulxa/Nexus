import React, { useState } from 'react';
import ShinyButton from '../components/magicui/ShinyButton';
import axios from 'axios';
import httpStatus from 'http-status';
import { useNavigate } from 'react-router-dom';
import { setMeetingId } from '../store/MeetingSlice';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import NeonGradientCard from '../components/magicui/NeonGradientCard ';
import { FaVideo, FaUsers, FaLock, FaCog, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';

function JoinAsGuest() {
    const [username, setUsername] = useState("");
    const [meetingCode, setMeetingCode] = useState("");
    const [isCreatingMeeting, setIsCreatingMeeting] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const connect = async () => {
        if (username.trim() === "") {
            alert("Please enter a username.");
            return;
        }
        try {
            if (isCreatingMeeting) {
                const response = await axios.post("http://localhost:8080/api/v1/meeting/create-meeting");
                if (response.status === httpStatus.CREATED) {
                    const meetingId = response.data.data.meetingCode;
                    dispatch(setMeetingId({ meetingId: meetingId }));
                    navigate(`/${meetingId}`, { state: { username } });
                    setUsername("");
                }
            } else {
                const response = await axios.post("http://localhost:8080/api/v1/meeting/join-meeting", { meetingId: meetingCode });
                if (response.status === httpStatus.CREATED) {
                    navigate(`/${meetingCode}`, { state: { username } });
                    setUsername("");
                    setMeetingCode("");
                }
            }
        } catch (error) {
            console.log("error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 relative overflow-hidden">
            {/* Background Elements */}
            <motion.div
                className="absolute top-0 left-0 w-64 h-64 bg-cyan-700 rounded-full opacity-20 filter blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full opacity-20 filter blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -90, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Main Container */}
            <div className="container mx-auto px-4 py-8 relative z-10">
                <header className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl font-bold text-white mb-4"
                    >
                        Welcome to
                        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 ml-2">
                            NEXUS
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-gray-300"
                    >
                        Connect, Communicate, Collaborate
                    </motion.p>
                </header>

                {/* Meeting Box */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800 p-8 rounded-lg shadow-2xl backdrop-blur-lg bg-opacity-80 border border-gray-700 mx-auto w-full sm:w-3/4 md:w-2/5"
                >
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">
                        {isCreatingMeeting ? 'Create a New Meeting' : 'Join a Meeting'}
                    </h2>
                    <input
                        type="text"
                        placeholder="Enter your meeting name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 text-gray-200 rounded-lg border-2 border-gray-600 focus:border-cyan-400 focus:outline-none transition-all duration-300 placeholder-gray-500 mb-4"
                    />
                    {!isCreatingMeeting && (
                        <input
                            type="text"
                            value={meetingCode}
                            onChange={(e) => setMeetingCode(e.target.value)}
                            placeholder="Enter Meeting ID"
                            className="w-full px-4 py-3 bg-gray-700 text-gray-200 rounded-lg border-2 border-gray-600 focus:border-cyan-400 focus:outline-none transition-all duration-300 placeholder-gray-500 mb-6"
                        />
                    )}
                    <div className="flex justify-center mt-6">
                        <ShinyButton text={isCreatingMeeting ? "Create Meeting" : "Join Meeting"} onClick={connect} />
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">or</p>
                        <button
                            onClick={() => setIsCreatingMeeting(prev => !prev)}
                            className="text-cyan-400 hover:text-cyan-300 underline transition-colors duration-300 mt-2 font-semibold"
                        >
                            {isCreatingMeeting ? 'Join an Existing Meeting' : 'Create a New Meeting'}
                        </button>
                    </div>
                </motion.div>

                {/* Bottom Section */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* FAQs */}
                    <NeonGradientCard
                        borderSize={1.5}
                        borderRadius={18}
                        neonColors={{
                            firstColor: "rgba(0, 255, 241, 0.7)",
                            secondColor: "rgba(0, 170, 255, 0.7)"
                        }}
                        glowOpacity={0.6}
                        blurAmount={15}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="bg-gray-900 bg-opacity-80 p-8 rounded-[16.5px] shadow-lg backdrop-blur-lg"
                        >
                            <h3 className="text-2xl font-semibold text-cyan-400 mb-4">FAQs</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <FaQuestionCircle className="text-cyan-400 text-2xl" style={{ marginTop: "3px" }} />
                                    <div>
                                        <h4 className="text-xl font-semibold text-white">How do I join a meeting?</h4>
                                        <p className="text-gray-300">You can join a meeting by entering the Meeting ID provided by the host in the "Join a Meeting" section.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <FaQuestionCircle className="text-cyan-400 text-2xl" style={{ marginTop: "3px" }} />
                                    <div>
                                        <h4 className="text-xl font-semibold text-white">How do I join a meeting?</h4>
                                        <p className="text-gray-300">You can join a meeting by entering the Meeting ID provided by the host in the "Join a Meeting" section.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <FaQuestionCircle className="text-cyan-400 text-2xl" style={{ marginTop: "3px" }} />
                                    <div>
                                        <h4 className="text-xl font-semibold text-white">Can I create my own meeting?</h4>
                                        <p className="text-gray-300">Yes, click on "Create a Meeting" to generate a new Meeting ID that you can share with others to join.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </NeonGradientCard>

                    {/* Quick Tips */}
                    <NeonGradientCard
                        borderSize={1.5}
                        borderRadius={18}
                        neonColors={{
                            firstColor: "rgba(0, 255, 241, 0.7)",
                            secondColor: "rgba(0, 170, 255, 0.7)"
                        }}
                        glowOpacity={0.6}
                        blurAmount={15}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="bg-gray-900 bg-opacity-80 p-8 rounded-[16.5px] shadow-lg backdrop-blur-lg"
                        >
                            <h3 className="text-2xl font-semibold text-cyan-400 mb-4">Quick Tips</h3>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Use a strong internet connection for the best experience.</li>
                                <li>Test your camera and microphone before joining a meeting.</li>
                                <li>Mute yourself when you're not speaking.</li>
                                <li>Use screen sharing to make presentations more interactive.</li>
                            </ul>
                        </motion.div>
                    </NeonGradientCard>
                </div>

            </div>
        </div>
    );
}

export default JoinAsGuest;

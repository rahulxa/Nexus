import React, { useEffect, useRef, useState } from 'react';
import ShinyButton from '../components/magicui/ShinyButton';
import axios from 'axios';
import GradualSpacings from '../components/magicui/GradualSpacing';
import httpStatus from 'http-status';
import { Link, useNavigate } from 'react-router-dom';
import { setMeetingId } from '../store/MeetingSlice';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import NeonGradientCard from '../components/magicui/NeonGradientCard ';
import { FaQuestionCircle } from 'react-icons/fa';
import Footer from "../components/Footer"


function Home() {
    axios.defaults.withCredentials = true;
    const [username, setUsername] = useState("");
    const [appUsername, setAppUsername] = useState("")
    const [meetingCode, setMeetingCode] = useState("");
    const [isCreatingMeeting, setIsCreatingMeeting] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let localVideoRef = useRef();
    const [audioAvailable, setAudioAvailable] = useState(false);
    const [videoAvailable, setVideoAvailable] = useState(false);
    const [streamReady, setStreamReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const connect = async () => {
        if (username.trim() === "") {
            alert("Please enter a username.");
            return;
        }
        if (!isCreatingMeeting) {
            if (meetingCode.trim() === "") {
                alert("Please enter the meeting code");
                return;
            }
        }
        try {
            if (isCreatingMeeting) {
                const response = await axios.post("http://localhost:8080/api/v1/meeting/create-meeting",
                    { username: appUsername }
                );
                if (response.status === httpStatus.CREATED) {
                    const meetingId = response.data.data.meetingCode;
                    dispatch(setMeetingId({ meetingId: meetingId }));
                    navigate(`/${meetingId}`, { state: { username } });
                    setUsername("");
                }
            } else {
                const response = await axios.post("http://localhost:8080/api/v1/meeting/join-meeting", {
                    meetingId: meetingCode,
                    username: appUsername
                });
                if (response.status === httpStatus.OK) {
                    navigate(`/${meetingCode}`, { state: { username } });
                    setUsername("");
                    setMeetingCode("");
                }
            }
        } catch (error) {
            console.log("error:", error);
        }
    };

    const getPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setVideoAvailable(true);
            setAudioAvailable(true);
            setStreamReady(true);
            window.localStream = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.log("Error getting permissions:", error);
            setErrorMessage("Unable to access camera or microphone. Please check your permissions.");
            if (error.name === 'NotAllowedError') {
                setVideoAvailable(false);
                setAudioAvailable(false);
            } else if (error.name === 'NotFoundError') {
                setErrorMessage("No camera or microphone found. Please check your devices.");
            }
        }
    };

    useEffect(() => {
        setAppUsername(localStorage.getItem("username"))
        getPermissions();
        return () => {
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (streamReady && localVideoRef.current && window.localStream) {
            localVideoRef.current.srcObject = window.localStream;
        }
    }, [streamReady]);


    const handleLogout = async () => {
        try {
            const logoutUser = await axios.post("http://localhost:8080/api/v1/users/logout");
            if (logoutUser.status === httpStatus.OK) {
                console.log("logged out")
                navigate("/")
            }
        } catch (error) {
            console.log("Error logging out:", error)
        }
    }


    return (
        <>
            <div className="min-h-screen bg-gradient-to-br bg-black p-4 relative overflow-hidden">
                {/* Background Elements */}
                <motion.div
                    className="absolute top-0 left-0 w-64 h-64 bg-black rounded-full opacity-20 filter blur-3xl"
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
                    className="absolute bottom-0 right-0 w-64 h-64 bg-black rounded-full opacity-20 filter blur-3xl"
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


                <div className="flex items-center justify-between relative z-10 -mt-5 ml-7 mr-7">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex-shrink-0"
                    >
                        <img src='MyLogo.png' className='h-20 w-auto mt-2' alt="Logo" />
                    </motion.div>

                    <p className='text-center text-lg font-semibold text-cyan-600 border-cyan-700 pb-1 inline-block ml-32'>
                        Welcome {appUsername}!
                    </p>

                    <div className="flex items-center space-x-4">

                        <Link to="/meeting-history" className='text-cyan-600 font-semibold hover:text-cyan-700 duration-300 ease-in-out'>
                            View Meeting History
                        </Link>

                        <button
                            className="rounded-md px-3 py-1 text-sm font-bold bg-transparent text-cyan-600 border-2 border-cyan-600 hover:bg-cyan-950 duration-300 ease-in-out"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>



                {/* Main Container */}
                <div className="container mx-auto px-4 py-8 relative z-10 mt-5">
                    <div className={`flex flex-col md:flex-row justify-center items-start gap-8 ${!(audioAvailable && videoAvailable) ? 'justify-center' : ''}`}>
                        {/* Video Object */}
                        {videoAvailable && (
                            <div className='w-full md:w-1/2 h-64 md:h-96'>
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    muted
                                    className="w-full h-full object-cover rounded-lg"
                                ></video>
                            </div>
                        )}

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="text-red-500 text-center mb-4">
                                {errorMessage}
                            </div>
                        )}

                        {/* Meeting Box */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`bg-gray-800 p-6 rounded-lg shadow-2xl backdrop-blur-lg bg-opacity-80 border border-gray-700 mx-auto w-full sm:w-2/3 md:w-1/3 ${isCreatingMeeting ? 'mt-10' : 'mt-1'}`}
                        >
                            <GradualSpacings
                                key={isCreatingMeeting ? 'Create a New Meeting' : 'Join a Meeting'}
                            >
                                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                                    {isCreatingMeeting ? 'Create a New Meeting' : 'Join a Meeting'}
                                </h2>
                            </GradualSpacings>
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
                            <div className="flex justify-center mt-3">
                                <ShinyButton text={isCreatingMeeting ? "Create Meeting" : "Connect"} onClick={connect} />
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-gray-400">or</p>
                                <button
                                    onClick={() => setIsCreatingMeeting(prev => !prev)}
                                    className="text-cyan-400 hover:text-cyan-300 underline transition-colors duration-300 mt-2 font-semibold"
                                >
                                    {isCreatingMeeting ? 'Join an Existing Meeting' : 'Create a New Meeting'}
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12">
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
                                transition={{ duration: 0.5 }}
                                className="h-64" // Reduced height from h-80 to h-64
                            >
                                <h2 className="text-2xl font-semibold text-center text-white mb-4"> {/* Reduced mb-6 to mb-4 */}
                                    FAQs
                                </h2>
                                <ul className="text-gray-400 space-y-3"> {/* Reduced space-y-4 to space-y-3 */}
                                    <li className="flex flex-col">
                                        <div className="flex items-center">
                                            <FaQuestionCircle className="text-cyan-400 mr-3 text-xl" />
                                            <span className="text-base">How do I create or join a meeting?</span> {/* Reduced text-lg to text-base */}
                                        </div>
                                        <span className="text-sm mt-1 ml-8"> {/* Reduced text-base to text-sm */}
                                            You can create a meeting by clicking the 'Create Meeting' button or by selecting the 'Join an Existing Meeting' link, then follow the prompts to set it up.
                                        </span>
                                    </li>
                                    <li className="flex flex-col">
                                        <div className="flex items-center">
                                            <FaQuestionCircle className="text-cyan-400 mr-3 text-xl" />
                                            <span className="text-base">How do i get the Meeting ID?</span> {/* Reduced text-lg to text-base */}
                                        </div>
                                        <span className="text-sm mt-1 ml-8">You can retrieve the Meeting ID from the meeting invite link.</span> {/* Reduced text-base to text-sm */}
                                    </li>
                                    <li className="flex flex-col">
                                        <div className="flex items-center">
                                            <FaQuestionCircle className="text-cyan-400 mr-3 text-xl" />
                                            <span className="text-base">Can I use NEXUS on mobile devices?</span> {/* Reduced text-lg to text-base */}
                                        </div>
                                        <span className="text-sm mt-1 ml-8">Yes, NEXUS is accessible on both mobile and desktop devices.</span> {/* Reduced text-base to text-sm */}
                                    </li>
                                </ul>
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
                                transition={{ duration: 0.5 }}
                                className="h-64" // Reduced height from h-80 to h-64
                            >
                                <h2 className="text-2xl font-semibold text-center text-white mb-4"> {/* Reduced mb-6 to mb-4 */}
                                    Quick Tips
                                </h2>
                                <ul className="text-gray-400 space-y-3"> {/* Reduced space-y-4 to space-y-3 */}
                                    <li className="flex items-center">
                                        <span className="text-cyan-400 mr-3">➤</span>
                                        <span className="text-base">Ensure your camera and microphone are on.</span> {/* Reduced text-lg to text-base */}
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-cyan-400 mr-3">➤</span>
                                        <span className="text-base">Join meetings a few minutes early to test your setup.</span> {/* Reduced text-lg to text-base */}
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-cyan-400 mr-3">➤</span>
                                        <span className="text-base">Use a stable internet connection for best results.</span> {/* Reduced text-lg to text-base */}
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-cyan-400 mr-3">➤</span> {/* Removed mb-8 */}
                                        <span className="text-base">Mute your microphone when not speaking to reduce background noise.</span> {/* Reduced text-lg to text-base and removed mb-1 */}
                                    </li>
                                </ul>
                            </motion.div>
                        </NeonGradientCard>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Home;

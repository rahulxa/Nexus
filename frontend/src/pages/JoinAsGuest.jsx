import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import httpStatus from "http-status";
import ShinyButton from '../components/magicui/ShinyButton';

function JoinAsGuest() {
    axios.defaults.withCredentials = true;
    const navigate = useNavigate();
    const [meetingId, setMeetingId] = useState("");
    const [username, setUsername] = useState("");
    let localVideoRef = useRef();
    const [audioAvailable, setAudioAvailable] = useState(false);
    const [videoAvailable, setVideoAvailable] = useState(false);
    const [streamReady, setStreamReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const connect = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/meeting/join-meeting", { meetingId });
            if (response.status === httpStatus.OK) {
                navigate(`/${meetingId}`, { state: { username } });
                setUsername("");
            }
        } catch (error) {
            console.log("joining error:", error);
        }
    }

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex flex-col items-center justify-center relative">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-700 rounded-full opacity-20 filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full opacity-20 filter blur-3xl"></div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Error Message */}
                {errorMessage && (
                    <div className="text-red-500 text-center mb-4 w-full">
                        {errorMessage}
                    </div>
                )}

                <div className={`flex ${videoAvailable ? 'flex-row' : 'flex-col'} items-center justify-center mt-16 gap-8 w-full max-w-6xl mx-auto`}>
                    {/* Video Object */}
                    {videoAvailable && (
                        <div className='w-1/2 h-96'>
                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                className="w-full h-full object-cover rounded-lg"
                            ></video>
                        </div>
                    )}

                    {/* Meeting Box */}
                    <div className={`bg-gray-800 p-6 ml-11 rounded-lg shadow-2xl backdrop-blur-lg bg-opacity-80 border border-gray-700 ${videoAvailable ? 'w-1/3' : 'w-full max-w-xs'}`}>
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">
                            Join a Meeting
                        </h2>
                        <input
                            type="text"
                            placeholder="Enter your Meeting name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg border-2 border-gray-600 focus:border-cyan-400 focus:outline-none transition-colors duration-300 placeholder-gray-500 mb-4"
                        />
                        <input
                            type="text"
                            value={meetingId}
                            onChange={(e) => setMeetingId(e.target.value)}
                            placeholder="Enter Meeting ID"
                            className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg border-2 border-gray-600 focus:border-cyan-400 focus:outline-none transition-colors duration-300 placeholder-gray-500 mb-6"
                        />
                        <div className="flex justify-center">
                            <ShinyButton text='Connect' onClick={connect} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JoinAsGuest;
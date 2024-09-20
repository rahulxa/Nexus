import React, { useState } from 'react'
import ShinyButton from '../components/magicui/ShinyButton';
import axios from 'axios';
import httpStatus from 'http-status';
import { useNavigate } from 'react-router-dom';
import { setMeetingId } from '../store/MeetingSlice';
import { useDispatch } from 'react-redux';

function JoinAsGuest() {
    // axios.defaults.withCredentials = true;
    const [message, setMessage] = useState("")
    const [username, setUsername] = useState("");
    const [meetingCode, setMeetingCode] = useState("")
    const [isCreatingMeeting, setIsCreatingMeeting] = useState(true)
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
                console.log("Response:", response)
                if (response.status === httpStatus.CREATED) {
                    const meetingId = response.data.data.meetingCode;
                    dispatch(setMeetingId({ meetingId: meetingId }));
                    navigate(`/${meetingId}`, { state: { username } });
                    setUsername("")
                }
            } else {
                const response = await axios.post("http://localhost:8080/api/v1/meeting/join-meeting", { meetingId: meetingCode });
                if (response.status === httpStatus.CREATED) {
                    navigate(`/${meetingCode}`, { state: { username } });
                    setUsername("")
                    setMeetingCode("")
                }
            }
        } catch (error) {
            console.log("here error:", error)
            // setMessage(error.response.data.message)
        }
    }

    return (
        <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex flex-col relative">
            <div className="flex flex-col items-center justify-center flex-grow bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen relative overflow-hidden">

                {/* Optional Decorative Background */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-700 rounded-full opacity-20 filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full opacity-20 filter blur-3xl"></div>
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-96 z-10">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        {isCreatingMeeting ? 'Create a New Meeting' : 'Join a Meeting'}
                    </h2>

                    {/* Username Input */}
                    <input
                        type="text"
                        placeholder="Enter your meeting name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg border-2 border-gray-600 focus:border-cyan-400 focus:outline-none transition-colors duration-300 placeholder-gray-500 mb-4"
                    />

                    {/* Meeting ID Input */}
                    {!isCreatingMeeting && (
                        <input
                            type="text"
                            value={meetingCode}
                            onChange={(e) => setMeetingCode(e.target.value)}
                            placeholder="Enter Meeting ID"
                            className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg border-2 border-gray-600 focus:border-cyan-400 focus:outline-none transition-colors duration-300 placeholder-gray-500 mb-6"
                        />
                    )}

                    {/* Connect Button */}
                    <div className="flex justify-center">
                        <ShinyButton text='Connect' onClick={connect} />
                    </div>

                    {/* Toggle Between Join and Create */}
                    <div className="mt-3 text-center">
                        <p className="text-gray-400">or</p>
                        <button
                            onClick={() => setIsCreatingMeeting(prev => !prev)}
                            className="text-[#06b6d4] hover:text-[#05a2bc] underline transition-colors duration-300 mt-2"
                        >
                            {isCreatingMeeting ? 'Join a Meeting' : 'Create a New Meeting'}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <footer className="absolute bottom-5 text-gray-400 text-sm w-full text-center">
                    <p>&copy; 2024 NEXUS. All Rights Reserved.</p>
                </footer>
            </div>
        </div>
    );
}

export default JoinAsGuest
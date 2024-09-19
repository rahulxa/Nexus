import React, { useState } from 'react'
import ShinyButton from '../components/magicui/ShinyButton';
import { useNavigate } from 'react-router-dom';
import { nanoid } from "nanoid"
import { setMeetingId } from '../store/MeetingSlice';
import { useDispatch } from 'react-redux';

function JoinAsGuest() {

    const disptach = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [message, setMessage] = useState("")
    const [meetingId, setMeetingId] = useState(null)

    const connect = () => {
        try {
            const response = a
        } catch (error) {

        }
        // navigate(`/${meetingId}`, { state: { username } }); 
    }

    return (
        <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex flex-col relative">
            <div className="w-full flex flex-col items-center justify-center flex-grow bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen relative overflow-hidden">

                {/* Optional Decorative Background */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-700 rounded-full opacity-20 filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full opacity-20 filter blur-3xl"></div>
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-96 z-10 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        Join a Meeting
                    </h2>

                    {/* Username Input */}
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg border-2 border-gray-600 focus:border-cyan-400 focus:outline-none transition-colors duration-300 placeholder-gray-500 mb-4"
                    />

                    {/* Meeting ID Input */}

                    <input
                        type="text"
                        placeholder="Enter Meeting ID"
                        className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg border-2 border-gray-600 focus:border-cyan-400 focus:outline-none transition-colors duration-300 placeholder-gray-500 mb-6"
                    />


                    {/* Connect Button */}
                    <div className="flex justify-center">
                        <ShinyButton text='Connect' onClick={connect} />
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
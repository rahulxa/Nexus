import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import ShinyButton from '../components/magicui/ShinyButton';
import axios from 'axios';
import { motion } from 'framer-motion';

function MeetingHistory() {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);

    const getMeetingHistory = async () => {
        const username = localStorage.getItem("username");
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/users/get-meeting-history?username=${username}`);
            const meetings = response.data.data;
            setMeetings(meetings);
        } catch (error) {
            console.log("error:", error);
        }
    };

    useEffect(() => {
        getMeetingHistory();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 120,
                damping: 20,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex flex-col items-center justify-center relative">
            <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-700 rounded-full opacity-20 filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full opacity-20 filter blur-3xl"></div>

            <motion.div
                className="container mx-auto -mt-80"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="flex items-center mb-4" variants={itemVariants}>
                    <ShinyButton
                        text={<BiArrowBack />}
                        onClick={() => navigate(-1)}
                        className="rounded-full"
                    />
                    <div className="flex-grow flex justify-center">
                        <h1 className="text-3xl font-bold text-cyan-700 mb-1 text-center -ml-12">Meeting History</h1>
                    </div>
                </motion.div>
                {meetings.length === 0 ? (
                    <motion.div
                        className="bg-gray-800 shadow-md rounded-lg overflow-hidden mt-10 p-8 text-center"
                        variants={itemVariants}
                    >
                        <p className="text-xl font-semibold text-gray-300">No meetings yet</p>
                        <p className="text-gray-400 mt-2">Your meeting history will appear here once you've participated in meetings.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        className="bg-gray-800 shadow-md rounded-lg overflow-hidden mt-10"
                        variants={itemVariants}
                    >
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Meeting Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {meetings.map((meeting, index) => {
                                    const meetingDate = new Date(meeting.date);
                                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                                    const formattedDate = meetingDate.toLocaleDateString(undefined, options);
                                    const formattedTime = meetingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    return (
                                        <motion.tr key={index} variants={itemVariants}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{meeting.meetingId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formattedDate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formattedTime}</td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default MeetingHistory;
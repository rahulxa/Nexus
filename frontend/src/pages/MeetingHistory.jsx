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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
            {/* Background effects */}
            <div className="fixed top-0 left-0 w-64 h-64 bg-cyan-700 rounded-full opacity-20 filter blur-3xl"></div>
            <div className="fixed bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full opacity-20 filter blur-3xl"></div>

            {/* Main content */}
            <motion.div
                className="max-w-6xl mx-auto pt-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div
                    className="flex items-center justify-between mb-8 px-4"
                    variants={itemVariants}
                >
                    <ShinyButton
                        text={<BiArrowBack />}
                        onClick={() => navigate(-1)}
                        className="rounded-full"
                    />
                    <h1 className="text-3xl font-bold text-cyan-700">Meeting History</h1>
                    <div className="w-10"></div> {/* Spacer for alignment */}
                </motion.div>

                {/* Content */}
                {meetings.length === 0 ? (
                    <motion.div
                        className="bg-gray-800/50 backdrop-blur-sm shadow-xl rounded-xl p-8 text-center mx-4"
                        variants={itemVariants}
                    >
                        <p className="text-xl font-semibold text-gray-300">No meetings yet</p>
                        <p className="text-gray-400 mt-2">Your meeting history will appear here once you've participated in meetings.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        className="bg-gray-800/50 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden mx-4"
                        variants={itemVariants}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Meeting Code</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/30">
                                    {meetings.map((meeting, index) => {
                                        const meetingDate = new Date(meeting.date);
                                        const formattedDate = meetingDate.toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        });
                                        const formattedTime = meetingDate.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        });

                                        return (
                                            <motion.tr
                                                key={index}
                                                variants={itemVariants}
                                                className="hover:bg-gray-700/30 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                                                    {meeting.meetingId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                    {formattedDate}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                    {formattedTime}
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default MeetingHistory;
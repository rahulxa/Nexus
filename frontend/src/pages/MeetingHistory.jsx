import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import ShinyButton from '../components/magicui/ShinyButton';
import axios from 'axios';

function MeetingHistory() {
    const navigate = useNavigate();

    const getMeetingHistory = async () => {
        const username = localStorage.getItem("username");
        try {
            const response = await axios.get("http://localhost:8080/api/v1/meeting/get-meeting-history",
                { username: username }
            );
            const meetings = response.data.data.meetingHistory;
            console.log("meetings:", meetings)
        } catch (error) {
            console.log("error:", error)
        }
    }

    useEffect(() => {
        getMeetingHistory()
    }, [])

    return (
        <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex flex-col items-center justify-center relative">
            <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-700 rounded-full opacity-20 filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full opacity-20 filter blur-3xl"></div>

            <div className="container mx-auto -mt-56">
                <div className="flex items-center mb-4">
                    <ShinyButton
                        text={<BiArrowBack />}
                        onClick={() => navigate(-1)}
                        className="rounded-full"
                    />
                    <div className="flex-grow flex justify-center">
                        <h1 className="text-3xl font-bold text-cyan-700 mb-1 text-center -ml-12">Meeting History</h1>
                    </div>
                </div>

                <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden mt-10">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Meeting Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">

                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200"></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400"></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400"></td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default MeetingHistory;

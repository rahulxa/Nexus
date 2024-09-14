import React, { useRef, useState } from 'react'
import io from "socket.io-client";
import ShinyButton from '../components/magicui/ShinyButton';
import { useEffect } from 'react';
import { useLocation } from "react-router-dom"

const serverUrl = "http://localhost:8080";

var connections = {}
const peerConfigConnections = {
    "iceservers": [{ "urls": "stun:stun.l.google.com:19302" }]
}

function VideoMeet() {

    var socketRef = useRef();
    let socketIdRef = useRef()
    let localVideoRef = useRef();
    const videoRef = useRef([])

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [showModal, setShowModal] = useState();
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    let [username, setUsername] = useState("")
    let [askForUsername, setAskForUsername] = useState(true);
    let [videos, setVideos] = useState([])
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }));

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipText, setTooltipText] = useState('Copy Meeting ID');

    const toggleMute = () => setIsMuted(!isMuted);
    const toggleVideo = () => setIsVideoOff(!isVideoOff);
    const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);


    const location = useLocation();
    const slug = location.pathname.split("/").pop();


    const handleCopy = () => {
        navigator.clipboard.writeText(slug);
        setTooltipText('Copied!');
        setTimeout(() => setTooltipText('Copy Meeting ID'), 2000); // Reset the tooltip text after 2 seconds
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }));
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);


    const getDisplayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDisplayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }


    const getPermissions = async () => {
        try {
            //allowing video access
            const videoPermisson = await navigator.mediaDevices.getUserMedia({ video: true });
            console.log("vid per:", videoPermisson)
            if (videoPermisson) {
                setVideoAvailable(true)
            } else {
                setVideoAvailable(false)
            }
            //allowing audio access
            const audioPermisson = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermisson) {
                setAudioAvailable(true)
            } else {
                setAudioAvailable(false)
            }
            //screen sharing access
            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true)
            } else {
                setScreenAvailable(false)
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable })
                console.log("med str:", userMediaStream);
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPermissions();
    }, [])

    const getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (error) {
            console.log(error)
        }
        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream)
            connections[id].createOffer()
                .then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
        }

        stream.getTracks()
            .forEach(track => track.onended = () => {
                setVideo(false)
                setAudio(false)

                try {
                    let tracks = localVideoRef.current.srcObject.getTracks()
                    tracks.forEach(track => track.stop())
                } catch (error) {
                    console.log(error)
                }

                const blackSilence = (...args) => new MediaStream([blackScreen(...args), silence()])
                window.localStream = blackSilence();
                localVideoRef.current.srcObject = window.localStream

                for (let id in connections) {
                    connections[id].addStream(window.localStream)
                    connections[id].createOffer()
                        .then((description) => {
                            connections[id].setLocalDescription(description)
                                .then(() => {
                                    socketIdRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                }
            })
    }

    //for when audio and video gets muted
    const silence = () => {
        let context = new AudioContext()
        let oscillator = context.createOscillator();

        let dst = oscillator.connect(context.createMediaStreamDestination());
        oscillator.start()
        context.resume()

        return Object.assign(dst.stream.getAudioTracks(), { enabled: false })
    }


    const blackScreen = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });

        canvas.getContext("2d").fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }


    const getUserMedia = () => {
        if (video && videoAvailable || audio && audioAvailable) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess) //getusermediasuccess
                .then((stream) => { })
                .catch(e => console.log(e))
        } else {
            try {
                const tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop());
            } catch (error) {

            }
        }
    }

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia()
        }
    }, [audio, video])


    const gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }


    const connectToSocketServer = () => {
        socketRef.current = io.connect(serverUrl, { secure: false });
        socketRef.current.on("signal", gotMessageFromServer);

        socketRef.current.on("connect", () => {
            socketRef.current.emit("join-call", window.location.href)
            socketIdRef.current = socketRef.current.id
            socketRef.current.on("chat-message", addMessage)
            socketRef.current.on("user-left", (id) => {
                setVideos(prevVideos => prevVideos.filter(video => video.socketId !== id));
            });

            socketRef.current.on("user-joined", (userJoinedId, clients) => {
                clients.forEach((socketsListId) => {
                    connections[socketsListId] = new RTCPeerConnection(peerConfigConnections);
                    connections[socketsListId].onicecandidate = (event) => {
                        if (event.candidate !== null) {
                            socketRef.current.emit("signal", socketsListId, JSON.stringify({ "ice": event.candidate }))
                        }
                    }
                    connections[socketsListId].onaddstream = (event) => {
                        setVideos(prevVideos => {
                            const videoExists = prevVideos.find(v => v.socketId === socketsListId);
                            if (videoExists) {
                                return prevVideos.map(v => v.socketId === socketsListId ? { ...v, stream: event.stream } : v);
                            } else {
                                return [...prevVideos, {
                                    socketId: socketsListId,
                                    stream: event.stream,
                                    autoPlay: true,
                                    playsInLine: true,
                                    username: username
                                }];
                            }
                        });
                    }

                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketsListId].addStream(window.localStream);
                    } else {
                        const blackSilence = (...args) => new MediaStream([blackScreen(...args), silence()])

                        window.localStream = blackSilence();
                        connections[socketsListId].addStream(window.localStream)
                    }
                });
                //id = id of the joined user
                if (userJoinedId === socketIdRef.current) {
                    for (let id in connections) { // exisiting id in connections object
                        if (id === socketIdRef) continue
                        try {
                            connections[id].addStream(window.localStream)
                        } catch (error) {
                            console.log(error)
                        }
                        connections[id].createOffer()
                            .then(description => connections[id].setLocalDescription(description))
                            .then(() => socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription })))
                            .catch(e => console.log(e))
                    }
                }
            });
        });
    }

    const getMedia = () => {
        setVideo(videoAvailable)
        setAudio(audioAvailable)
        connectToSocketServer();
    }

    const connect = () => {
        console.log("clicked")
        setAskForUsername(false)
        getMedia()
    }


    const handleTurnOffVideo = () => {
        setVideo(!video)
    }

    const handleTurnOfAudio = () => {
        setAudio(!audio)
    }

    const getDisplayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks()
                .forEach(track => track.stop())
        } catch (e) {
            console.log(e)
        }
        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;
            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks()
            .forEach(track => track.onended = () => {
                setScreen(false);

                try {
                    let tracks = localVideoRef.current.srcObject.getTracks()
                    tracks.forEach(track => track.stop())
                } catch (error) {
                    console.log(error)
                }

                const blackSilence = (...args) => new MediaStream([blackScreen(...args), silence()])
                window.localStream = blackSilence();
                localVideoRef.current.srcObject = window.localStream

                getUserMedia();
            });
    }



    useEffect(() => {
        if (screen !== undefined) {
            getDisplayMedia();
        }
    }, [screen])


    const handleScreenSharing = () => {
        if (screen) {
            // Stop screen sharing
            let tracks = window.localStream.getTracks();
            tracks.forEach(track => track.stop()); // Stop the screen share tracks

            // Switch back to regular camera stream
            getUserMedia();
        } else {
            // Start screen sharing
            getDisplayMedia();
        }
        setScreen(!screen);
    };


    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages, { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages(prevNewMessages => prevNewMessages + 1)
        }
    }


    const handleSendMessage = () => {
        socketRef.current.emit('chat-message', message, username)
        setMessage("");
    }


    const handleToggleChat = () => {
        setIsChatOpen(!isChatOpen);
        setNewMessages(0);
    };

    let handleEndCall = () => {
        try {
            let tracks = localVideoRef.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) {
            console.log(e)
        }
        window.location.href = "/"
    }


    const getGridClass = (count) => {
        if (count <= 1) return 'grid-cols-1';
        if (count === 2) return 'grid-cols-2';
        if (count <= 4) return 'grid-cols-2 grid-rows-2';
        if (count <= 9) return 'grid-cols-3 grid-rows-3';
        return 'grid-cols-4 grid-rows-4';
    };


    return (
        <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex flex-col relative">
            {askForUsername ? (
                <div className="flex flex-col items-center justify-center flex-grow">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-white mb-4">Join Video Call</h2>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg border-2 border-gray-600 focus:border-cyan-400 focus:outline-none transition-colors duration-300 placeholder-gray-500 mb-4"
                        />
                        <ShinyButton text="Connect" onClick={connect} />
                    </div>
                </div>
            ) : (
                <>
                    {/* Video Container */}
                    <div className={`flex-grow flex items-center justify-center overflow-hidden transition-all duration-300 ${isChatOpen ? 'w-8/12' : 'w-full'}`}>
                        <div className="w-full max-w-6xl h-full">
                            <div className={`grid gap-4 w-full h-full p-4 ${getGridClass(videos.length + 1)}`}>
                                <div className={`relative ${videos.length === 0 ? 'col-span-full row-span-full' : ''}`}>
                                    <div className={`relative ${videos.length === 0 ? 'w-3/5 h-4/5 mx-auto' : 'w-full h-full'}`}>
                                        <video
                                            ref={localVideoRef}
                                            autoPlay
                                            muted
                                            className="w-full h-full object-cover rounded-lg"
                                        ></video>
                                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
                                            <span className="text-white text-sm">You</span>
                                        </div>
                                    </div>
                                </div>
                                {videos.map((video) => (
                                    <div key={video.socketId} className="relative">
                                        <video
                                            data-socket={video.socketId}
                                            ref={(ref) => {
                                                if (ref && video.stream) {
                                                    ref.srcObject = video.stream;
                                                }
                                            }}
                                            autoPlay
                                            className="w-full h-full object-cover rounded-lg"
                                        ></video>
                                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
                                            <span className="text-white text-sm">{video.username}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className={`flex justify-between p-3 ${isChatOpen ? 'w-8/12' : 'w-full'}`}>
                        <div>
                            <h3 className='text-gray-300 text-md font-semibold mt-4'>Rahul</h3>
                        </div>
                        <div className="bg-gray-800 rounded-full shadow-lg ml-28">
                            <div className="flex space-x-14 p-1">
                                <button className="p-3 rounded-full hover:bg-gray-700 transition-colors duration-300"
                                    onClick={() => {
                                        toggleMute();
                                        handleTurnOfAudio();
                                    }}
                                    title={isMuted ? "Unmute" : "Mute"}
                                >
                                    <i className={`fas ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'} text-white text-xl`}></i>
                                </button>
                                <button className="p-3 rounded-full hover:bg-gray-700 transition-colors duration-300"
                                    onClick={() => {
                                        toggleVideo();
                                        handleTurnOffVideo()
                                    }}
                                    title={isVideoOff ? "Turn on camera" : "Turn off camera"}
                                >
                                    <i className={`fas ${isVideoOff ? 'fa-video-slash' : 'fa-video'} text-white text-xl`}></i>
                                </button>
                                <button className="p-3 rounded-full hover:bg-gray-700 transition-colors duration-300"
                                    onClick={() => {
                                        toggleScreenShare();
                                        handleScreenSharing();
                                    }}
                                    title={isScreenSharing ? "Stop sharing screen" : "Share screen"}
                                >
                                    <i className={`fas ${isScreenSharing ? 'fa-stop-circle' : 'fa-desktop'} text-white text-xl`}></i>
                                </button>
                                <button className="p-3 rounded-full hover:bg-gray-700 transition-colors duration-300 relative" onClick={handleToggleChat} title="Open chat">
                                    <i className="fas fa-comment-alt text-white text-xl"></i>
                                    {newMessages > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-blue-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {newMessages > 99 ? '99+' : newMessages}
                                        </span>
                                    )}
                                </button>
                                <button className="p-2 rounded-full bg-red-800 hover:bg-red-900 transition-colors duration-300"
                                    title='End call'
                                    onClick={handleEndCall}
                                >
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        <i className="fas fa-phone-alt text-white text-xl transform rotate-135"></i>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className='flex'>
                            <h6 className='text-gray-300 text-md font-semibold mt-4'>{currentTime.toUpperCase()}</h6>
                            <p className='text-gray-300 mt-3 text-xl ml-4'>|</p>
                            <div
                                className="relative group"
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                                onClick={handleCopy}
                            >
                                <h6 className='text-gray-300 text-md font-semibold mt-4 ml-4 cursor-pointer'>{slug}</h6>
                                {showTooltip && (
                                    <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-0 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out shadow-lg whitespace-nowrap'>
                                        {tooltipText}
                                        <div className='absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800'></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* chat box */}
                    {isChatOpen &&
                        <div
                            className={`fixed mb-10 rounded-lg top-0 right-0 h-[95%] w-0 md:w-0 lg:w-[28%] bg-gray-900 p-6 shadow-lg transition-all duration-300 ease-in-out ${isChatOpen ? 'w-full md:w-[35%]' : 'w-0'}`}
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className='flex justify-between items-center mb-4 border-b border-gray-700 pb-2'>
                                    <div className="text-gray-200 font-semibold text-lg">
                                        In-call Messages
                                    </div>
                                    <button
                                        onClick={handleToggleChat}
                                        className="text-gray-400 hover:text-white transition-colors duration-300 p-2 rounded-full flex items-center justify-center text-2xl"
                                        title="Close"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                                {/* Messages Section */}
                                <div className="flex-grow text-white overflow-y-auto mb-4 space-y-3">
                                    {messages.length !== 0 ? (
                                        messages.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-800 p-3 rounded-lg shadow-sm"
                                                style={{
                                                    animation: `fadeInUp 0.4s ease ${index * 0.1}s forwards`,
                                                    opacity: 0
                                                }}
                                            >
                                                <p className="text-cyan-400 font-semibold text-sm">{item.sender}</p>
                                                <p className="text-gray-300 text-sm mt-1">{item.data}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-500">
                                            <p>No messages yet!</p>
                                        </div>
                                    )}
                                </div>
                                {/* Input Section */}
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSendMessage();
                                            }
                                        }}
                                        className="w-full text-sm p-3 rounded-full bg-gray-800 text-gray-300 border border-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="bg-cyan-500 hover:bg-cyan-600 text-white p-3 ml-3 rounded-full flex items-center justify-center transition-colors duration-300 shadow-md"
                                        title='Send'
                                    >
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </>)
            }
        </div >
    );
}

export default VideoMeet       
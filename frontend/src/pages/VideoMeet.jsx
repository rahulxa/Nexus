import React, { useRef, useState } from 'react'
import io from "socket.io-client";
import ShinyButton from '../components/magicui/ShinyButton';
import { useEffect } from 'react';
import '../styles/videoMeet.css';

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
    let [username, setUsername] = useState("")
    let [askForUsername, setAskForUsername] = useState(true);
    let [videos, setVideos] = useState([])

    //later
    // if (isChrome === true) {
    // }

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const toggleMute = () => setIsMuted(!isMuted);
    const toggleVideo = () => setIsVideoOff(!isVideoOff);
    const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);


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


    const addMessage = () => { }

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
                                    playsInLine: true
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
            })
        })
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

    useEffect(() => {
        console.log("videos updated:", videos);
    }, [videos]);

    const getGridClass = (participantCount) => {
        switch (participantCount) {
            case 1:
                return 'single-video';
            case 2:
                return 'two-videos';
            case 3:
            case 4:
                return 'four-videos';
            case 5:
            case 6:
                return 'six-videos';
            default:
                return 'multi-videos';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex flex-col">
            {askForUsername === true ? (
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
                        <ShinyButton text='Connect' onClick={connect} />
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex-grow flex justify-center items-center ">
                        <div className={`video-grid ${getGridClass(videos.length + 1)}`}>
                            <div className="video-wrapper">
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    muted
                                    className="video-element"
                                ></video>
                                <div className="video-label">
                                    <span className="text-white text-sm">You</span>
                                </div>
                            </div>
                            {videos.map((video) => (
                                <div key={video.socketId} className="video-wrapper">
                                    <video
                                        data-socket={video.socketId}
                                        ref={ref => {
                                            if (ref && video.stream) {
                                                ref.srcObject = video.stream;
                                            }
                                        }}
                                        autoPlay
                                        className="video-element"
                                    ></video>
                                    <div className="video-label">
                                        <span className="text-white text-sm">{video.socketId}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
            {askForUsername === false ? (
                <div className="video-controls">
                    <div className="control-wrapper">
                        <button className="control-button" onClick={toggleMute}>
                            <i className={`fas ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                        </button>
                        <span className="tooltip">{isMuted ? "Unmute" : "Mute"}</span>
                    </div>
                    <div className="control-wrapper">
                        <button className="control-button" onClick={toggleVideo}>
                            <i className={`fas ${isVideoOff ? 'fa-video-slash' : 'fa-video'}`}></i>
                        </button>
                        <span className="tooltip">{isVideoOff ? "Turn on camera" : "Turn off camera"}</span>
                    </div>
                    <div className="control-wrapper">
                        <button className="control-button" onClick={toggleScreenShare}>
                            <i className={`fas ${isScreenSharing ? 'fa-stop-circle' : 'fa-desktop'}`}></i>
                        </button>
                        <span className="tooltip">{isScreenSharing ? "Stop sharing" : "Share screen"}</span>
                    </div>
                    <div className="control-wrapper">
                        <button className="control-button">
                            <i className="fas fa-comment-alt"></i>
                        </button>
                        <span className="tooltip">Chat</span>
                    </div>
                    <div className="control-wrapper">
                        <button className="control-button end-call">
                            <i className="fas fa-phone-slash"></i>
                        </button>
                        <span className="tooltip">Leave call</span>
                    </div>
                </div>
            ) :
                (<></>)
            }
        </div >
    )
}

export default VideoMeet       
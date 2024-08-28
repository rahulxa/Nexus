import React, { useRef, useState } from 'react'
import ShinyButton from '../components/magicui/ShinyButton';
import { useEffect } from 'react';

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
        const signal = JSON.parse(message);
        if (id !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)
                    .then(() => {
                        if (signal.sdp.type === "offer") {
                            connections[fromId].createAnswer()
                                .then((description) => {
                                    connections[fromId].setLocalDescription(description)
                                        .then(() => {
                                            socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }))
                                        }).catch(e => console.log(e))
                                }).catch(e => console.log(e))
                        }
                    }).catch(e => console.log(e))
                )
                if (signal.ice) {
                    connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice))
                        .catch(e => console.log(e))
                }
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
            socketRef.on("user-left", (id) => {
                setVideo((videos) => videos.filter(video => video.socketId !== id));
            })

            socketRef.current.on("user-joined", (id, clients) => {
                clients.forEach((socketsListId) => {
                    connections[socketsListId] = new RTCPeerConnection(peerConfigConnections);
                    connections[socketsListId].onicecandidate = (event) => {
                        if (event.candidate !== null) {
                            socketRef.current.emit("signal", socketsListId, JSON.stringify({ "ice": event.candidate }))
                        }
                    }
                    connections[socketsListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketsListId);

                        if (videoExists) {
                            setVideo(videos => {
                                const updatedVideos = videos.map(video => video.socketId === socketsListId ? { ...video, stream: event.stream } : video)
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            const newVideo = {
                                socketId: socketsListId,
                                stream: event.stream,
                                autoPlay: true,
                                playsInLine: true
                            }
                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo]
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    }

                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketsListId].addStream(wondow.localStream);
                    } else {

                    }
                });

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef) continue
                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (error) {
                            console.log(error)
                        }
                        connections[id2].createOffer()
                            .then(description => connections[id2].setLocalDescription(description))
                            .then(() => socketRef.current.emit("signal", id2, JSON.stringify({ "sdp": connections[id2].localDescription })))
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

    return (
        <div className='' style={{ backgroundImage: 'url(back2.jpg)' }}>
            {askForUsername === true ? (
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-64 mt-10 ml-20 px-4 py-2 bg-gray-900 text-gray-200 rounded-lg border-2 border-gray-700 focus:border-cyan-400 focus:outline-none transition-colors duration-300 placeholder-gray-500"
                    />
                    <ShinyButton text='Connect' onClick={connect} />
                    <div>
                        <video ref={localVideoRef} autoPlay muted></video>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}

export default VideoMeet       
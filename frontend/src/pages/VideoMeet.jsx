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
                            socketIdRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
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
        const signal = JSON.parse(message);
        if (fromId !== socketIdRef.current) {
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

            socketRef.current.on("user-joined", (userJoinedId, clients) => {
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
                            .then(() => socketRef.current.emit("signal", id2, JSON.stringify({ "sdp": connections[id].localDescription })))
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
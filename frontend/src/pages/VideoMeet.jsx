import React, { useRef, useState } from 'react'


const serverUrl = "http://localhost:8080";

var connection = {}
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
    let [video, setVideo] = useState();
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

    return (
        <div>
            {askForUsername === true ? (
                <>asdjks</>
            ) : (
                <></>
            )}
        </div>
    )
}

export default VideoMeet    
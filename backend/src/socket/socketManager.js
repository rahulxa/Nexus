import { Server } from "socket.io"

let connections = {}
let messages = {}
let timeOnline = {}

//connections example
// {
//     "room1": ["abc123", "def456"],
//     "room2": ["ghi789"]
// }

const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET,POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    //listening for connections
    io.on("connection", (socket) => {
        socket.on("join-call", (path) => { //path is the room
            if (connections[path] === undefined) {
                connections[path] = [] //uss specific room k liye ek empty array create hota hai taaki ab jo bhi naye user join ho unke id's ko iss room k array mai push kiya jaa sake 
            }
            connections[path].push(socket.id); //uss specific path(room) k array mai uss user k id ko push kardo
            timeOnline[socket.id] = new Date();

            connections[path].forEach(element => {
                io.to(element).emit("user-joined", socket.id, connections[path]) //notifying every user of the new joinee
            });

            if (messages[path] !== undefined) {
                messages[path].forEach(element => {
                    io.to(socket.id).emit("chat-message", element['data'], element['sender'], element["socket-id-sender"]);
                });
            };
        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message)
        });

        socket.on("chat-message", (data, sender) => {
            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => { //room = whole room, roomKey = roomName , roomvalue = people in that room 
                    if (!isFound && roomValue.includes(socket.id)) { ////room is the complete room including the room value
                        return [roomKey, true]
                    }
                    return [room, isFound]
                }, ["", false]);

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }
                messages[matchingRoom].push({ 'sender': sender, 'data': data, "socket-id-sender": socket.id });
                console.log("message:", key, ":", sender, data)

                connections[matchingRoom].forEach(elem => {
                    io.to(elem).emit("chat-message", data, sender, socket.id)
                })
            }
        });

        socket.on("disconnect", () => {
            var diffTime = Math.abs(timeOnline[socket.id] - new Date());
            var key;

            for (const [room, person] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
                for (let a = 0; a < person.length; a++) {
                    if (person[a] === socket.id) {
                        key = room;
                        for (let a = 0; a < connections[key].length; a++) {
                            io.to(connections[key][a]).emit('user-left', socket.id)
                        }
                        var index = connections[key].indexOf(socket.id)
                        connections[key].splice(index, 1)
                        if (connections[key].length === 0) {
                            delete connections[key]
                        }
                    }
                }
            }
        })
    });
    return io;
}

export default connectToSocket;
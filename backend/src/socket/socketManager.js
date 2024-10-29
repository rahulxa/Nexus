import { Server } from "socket.io"

let connections = {}
let messages = {}
let timeOnline = {}
const usernames = {};

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
        socket.on("join-call", (data) => {
            const { path, username } = data;
            if (connections[path] === undefined) {
                connections[path] = [];
            }

            // Store username mapping
            usernames[socket.id] = username;
            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            // Create array of existing users with their usernames
            const existingUsers = connections[path].map(socketId => ({
                socketId,
                username: usernames[socketId]
            }));

            // Notify existing users about new user
            connections[path].forEach(element => {
                if (element !== socket.id) { // Don't send to the new user
                    io.to(element).emit("user-joined", {
                        socketId: socket.id,
                        username: username,
                        allUsers: existingUsers
                    });
                }
            });

            // Send existing users info to new user
            io.to(socket.id).emit("user-list", existingUsers);

            if (messages[path] !== undefined) {
                messages[path].forEach(element => {
                    io.to(socket.id).emit("chat-message", element['data'], element['sender'], element["socket-id-sender"]);
                });
            }
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
                // console.log("message:", key, ":", sender, data)

                connections[matchingRoom].forEach(elem => {
                    io.to(elem).emit("chat-message", data, sender, socket.id)
                })
            }
        });

        socket.on("disconnect", () => {
            delete usernames[socket.id];
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
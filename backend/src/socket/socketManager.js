import { Server } from "socket.io"

let connections = {}
let messages = {}
let timeOnline = {}

const connectToSocket = (server) => {
    const io = new Server(server);

    //listening for connections
    io.on("connection", (socket) => {
        socket.on("join-call", (path) => {
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

        });

        socket.on("disconnect", () => {

        })
    });

    return io;
}

export default connectToSocket;
import { Server } from "socket.io"

const connectToSocket = (server) => {
    const io = new Server();
    return io;
}

export default connectToSocket;
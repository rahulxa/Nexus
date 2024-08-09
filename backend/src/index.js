import connectDB from "./db/index.js";
import dotenv from "dotenv"
import { app } from "./app.js";
import { createServer } from "node:http"
import { Server } from "socket.io"
import connectToSocket from "./socket/socketManager.js";

dotenv.config({
    path: "./env"
})

const PORT = process.env.PORT || 8080;

const server = createServer(app);
const io = connectToSocket(server)

connectDB()
    .then(() => {
        server.on("error", (err) => {
            console.log("error connecting to the server:", err)
            throw err;
        });
        server.listen(PORT, () => {
            console.log("server listening at port:", PORT)
        });
    })
    .catch((err) => {
        console.log("mongo db connection fail:", err);
    });





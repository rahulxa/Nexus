import express from "express"
import bodyParser from "body-parser";
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser()); //cookies for storing access and refresh tokens

// app.get("/home", (req, res) => {
//     res.json({ "hello": "niggachu" })
// })

export { app }
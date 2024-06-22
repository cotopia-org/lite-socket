import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import 'dotenv/config.js'
import event from "./src/events.js";
import router from "./src/router.js";

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log('connected', socket)
    io.emit("message", "welcome");

    event(socket)
});


router(app)

console.log(`Server listen on ${port}`)
httpServer.listen(port);



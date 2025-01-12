import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import 'dotenv/config.js'
import router from "./src/routes/router.js";
import axiosInstance from "./packages/axios.js";
import {log} from "./packages/logger.js";
import cors from 'cors'
import messagesRegister from "./src/events/messages.js";
import usersRegister from "./src/events/users.js";
import {findClient} from "./packages/utils.js";

import redis from 'redis'
import listener from "./src/listeners/listeners.js";

const app = express();

const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || "6379",
    }
});
redisClient.connect();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())
app.options('*', cors());


// Sentry.setupExpressErrorHandler(app);


const httpServer = createServer(app);
const port = process.env.PORT || 3010;

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        credentials: true
    }
});


io.on("connection", async (socket) => {
    socket.on("ping", (callback) => {

        callback();
    });

    const authToken = socket.handshake.query.userToken
    const id = socket.handshake.query.id
    const username = socket.handshake.query.username

    if (authToken === undefined) {
        log('Disconnected, for no authToken')

        socket.disconnect()
    } else {

        console.log(id, username)

        const connectedResponse = await axiosInstance.post('/connected', {
            socket_id: socket.id
        }, {'headers': {'Authorization': `Bearer ${authToken}`}});
        const connectedResponseData = connectedResponse.data.data

        const client = await findClient(io, connectedResponseData.id)
        if (client !== undefined) {
            client.status = 'disable'
        }
        socket.user_id = connectedResponseData.id
        socket.username = connectedResponseData.username
        socket.status = 'enable'

        log('Connected', connectedResponseData.username)


        socket.emit('joined', true)


        if (connectedResponseData.channels.length > 0) {
            connectedResponseData.channels.forEach(channel => {
                socket.join(channel);

            })

        }


        socket.on("disconnect", () => {
            log('Disconnected', socket.username)
            disconnected(authToken, socket.id, socket.status)


        });


        messagesRegister(socket, authToken)
        usersRegister(socket, authToken)


    }


})
listener(redisClient, io)
router(app, io)


const disconnected = async (authToken, socket_id, socket_status) => {

    const now = new Date();

    // Extract date components
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');

    // Extract time components
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Combine into desired format
    const nowStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    await axiosInstance.get('/disconnected?offline=true&socket_status=' + socket_status + '&now=' + nowStr, {
        'headers': {
            'Authorization': `Bearer ${authToken}`,
            'Socket-Id': socket_id
        }
    })
}


console.log(`Server listen on ${port}`)
httpServer.listen(port);



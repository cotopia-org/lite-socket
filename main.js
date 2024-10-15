import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import 'dotenv/config.js'
import router from "./src/routes/router.js";
import axiosInstance from "./packages/axios.js";
import {log} from "./packages/logger.js";
import cors from 'cors'
// import Sentry from "./app/sentry.js";
import {instrument} from '@socket.io/admin-ui'
import messagesRegister from "./src/events/messages.js";
import usersRegister from "./src/events/users.js";
import {findClient} from "./packages/utils.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())
app.options('*', cors());


// Sentry.setupExpressErrorHandler(app);


const httpServer = createServer(app);
const port = process.env.PORT || 3010;

const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io", "https://lite.cotopia.social", '*'],
        credentials: true
    }
});

instrument(io, {
    auth: false,
    mode: "development",
});

io.on("connection", async (socket) => {
    socket.on("ping", (callback) => {

        callback();
    });

    const authToken = socket.handshake.query.userToken

    if (authToken === undefined) {
        log('Disconnected, for no authToken')

        socket.disconnect()
    } else {
        const connectedResponse = await axiosInstance.post('/connected', {
            socket_id: socket.id
        }, {'headers': {'Authorization': `Bearer ${authToken}`}});

        const data = connectedResponse.data.data

        const client = await findClient(io, data.id)
        if (client !== undefined) {
            client.disconnect()
        }
        socket.user_id = data.id
        socket.username = data.username


        log('Connected', data.username)


        socket.emit('joined', true)

        if (data.channels.length > 0) {
            data.channels.forEach( channel => {
                socket.join(channel);

            })

        }


        socket.on("disconnect", () => {
            log('Disconnected', socket.username)
            disconnected(authToken)


        });


        messagesRegister(socket, authToken)
        usersRegister(socket, authToken)
    }


})

router(app, io)


const disconnected = async (authToken) => {
    await axiosInstance.get('/disconnected?offline=true', {'headers': {'Authorization': `Bearer ${authToken}`}})
}


console.log(`Server listen on ${port}`)
httpServer.listen(port);



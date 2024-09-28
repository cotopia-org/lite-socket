import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import 'dotenv/config.js'
import event from "./src/events.js";
import router from "./src/router.js";
import axiosInstance from "./app/axios.js";
import {log} from "./app/logger.js";
import cors from 'cors'
// import Sentry from "./app/sentry.js";

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
        origin: "*",
        credentials: true
    }
});


let sockets = {}

io.on("connection", async (socket) => {
    socket.on("ping", (callback) => {

        callback();
    });

    const authToken = socket.handshake.query.userToken

    if (authToken === undefined) {
        log('Disconnected, for no authToken')

        socket.disconnect()
    } else {
        await axiosInstance.post('/connected', {
            socket_id: socket.id
        }, {'headers': {'Authorization': `Bearer ${authToken}`}}).then(async res => {


            const data = res.data.data


            socket.user_id = data.id
            socket.username = data.username
            sockets[res.data.data.id] = socket


            log('Connected', data.username)


            socket.emit('joined', true)

            if (data.channels.length > 0) {
                data.channels.forEach(channel => {
                    socket.join(channel);

                })

            }



        }).catch(e => {
            log('Error', e)
            log('Error', e.message)
            socket.disconnect()

        })


        socket.on("disconnect", () => {
            log('Disconnected', socket.username)
            disconnected(authToken)

            delete sockets[socket.user_id]


        });


        event(socket, authToken)
    }


})

router(app, io, sockets)


const disconnected = async (authToken) => {
    await axiosInstance.get('/disconnected?offline=true', {'headers': {'Authorization': `Bearer ${authToken}`}})
}


console.log(`Server listen on ${port}`)
httpServer.listen(port);



import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import 'dotenv/config.js'
import event from "./src/events.js";
import router from "./src/router.js";
import axiosInstance from "./app/axios.js";
import {log} from "./app/logger.js";
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())
app.options('*', cors());

const httpServer = createServer(app);
const port = process.env.PORT || 3010;

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        // or with an array of origins
        // origin: ["https://my-frontend.com", "https://my-other-frontend.com", "http://localhost:3000"],
        credentials: true
    }
});

io.on("connection", async (socket) => {

    log('Here')

    const authToken = socket.handshake.query.userToken
    log(authToken)

    if (authToken === undefined) {
        log('Disconnected, for no authToken')

        socket.disconnect()
    }

    await axiosInstance.get('/users/me', {'headers': {'Authorization': `Bearer ${authToken}`}}).then(res => {


        const data = res.data.data

        log('Connected', res.data.data.username)


        if (data.workspaces.length > 0) {
            data.workspaces.forEach(w => {
                socket.join(`workspace-${w.id}`);

            })

        }

        if (data.directs.length > 0) {
            data.directs.forEach(r => {
                socket.join(`room-${r.id}`);

            })

        }

        if (data.room !== null) {
            socket.join(`room-${data.room.id}`);


        }
    }).catch(e => {
        log('Error', e.message)
        socket.disconnect()

    })
    // console.log('Here')
    log('Connected')
    log('Rooms', socket.rooms)

    socket.on("disconnect", () => {
        log('Disconnected')
    });


    event(socket)
})
;


router(app, io)

console.log(`Server listen on ${port}`)
httpServer.listen(port);



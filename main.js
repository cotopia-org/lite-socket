import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import 'dotenv/config.js'
import event from "./src/events.js";
import router from "./src/router.js";
import axiosInstance from "./app/axios.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const httpServer = createServer(app);
const port = process.env.PORT || 3000;

const io = new Server(httpServer);

io.on("connection", (socket) => {


    // const authToken = socket.handshake.query.userToken
    // axiosInstance.get('/users/me', {'headers': {'Authorization': `Bearer ${authToken}`}}).then(res => {
    //
    //
    //     const data = res.data.data
    //
    //     console.log('Connected', res.data.data.username)
    //
    //
    //     if (data.workspaces.length > 0) {
    //         data.workspaces.forEach(w => {
    //             socket.join(`workspace-${w.id}`);
    //
    //         })
    //
    //     }
    // })
    // console.log('Here')
    console.log('CONNECTED')


    socket.on("disconnect", () => {
        console.log('Disconnected')
    });


    event(socket)
})
;


router(app, io)

console.log(`Server listen on ${port}`)
httpServer.listen(port);



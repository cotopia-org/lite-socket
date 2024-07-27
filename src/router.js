import {log} from "../app/logger.js";

const router = (router, io, socket) => {
    router.get('/', (req, res) => {
        return res.json('Chat is ready')
    })


    router.post('/emit', async (req, res) => {


        log(req.body)

        if (req.body.eventName === 'joinedRoom') {
            await socket.join(`room-${req.body.data}`);
            log(socket, socket.rooms, req.body.data)


        } else {
            io.to(req.body.channel).emit(req.body.eventName, req.body.data);

        }


        return res.json('Data received')
    })
}


export default router;

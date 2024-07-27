import {log} from "../app/logger.js";

const router = (router, io, socket) => {
    router.get('/', (req, res) => {
        return res.json('Chat is ready')
    })


    router.post('/emit', (req, res) => {


        log(req.body)

        if (req.body.eventName === 'joinedRoom') {
            socket.join(`room-${req.body.data}`);
            log('Rooms', socket.rooms)


        } else {
            io.to(req.body.channel).emit(req.body.eventName, req.body.data);

        }


        return res.json('Data received')
    })
}


export default router;

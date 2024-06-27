import {log} from "../app/logger.js";

const router = (router, io) => {
    router.get('/', (req, res) => {
        return res.json('Chat is ready')
    })


    router.post('/emit', (req, res) => {


        log(req.body)
        io.to(req.body.channel).emit(req.body.eventName, req.body.data);


        return res.json('Data received')
    })
}


export default router;

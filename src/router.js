import {log} from "../app/logger.js";

const router = (router, io) => {
    router.get('/', (req, res) => {
        return res.json('Salam')
    })


    router.post('/emit', (req, res) => {


        log(req.body)
        io.to(req.body.channel).emit(req.body.eventName, req.body.data);


        return res.json('Salam')
    })
}


export default router;

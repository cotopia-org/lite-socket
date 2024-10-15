import {log} from "../app/logger.js";

const router = (router, io, sockets) => {
    router.get('/', (req, res) => {
        return res.json('Chat is ready')
    })


    router.get('/sockets/:userId', (req, res) => {
        const userId = req.params.userId

        if (Object.keys(sockets).includes(userId)) {
            return res.json(Array.from(sockets[userId].rooms))

        }
        return res.json('Not Found')

    })
    router.get('/sockets', async (req, res) => {

        const data = []


        const clients = await io.sockets.sockets;
        console.log(clients)
        Array.from(clients).map(client => {
            data.push({
                id: client.user_id,
                socket_id: client.id,
                username: client.username,
                rooms: Array.from(client.rooms),
            })
        })

        return res.json(data)
    })

    router.post('/emit', async (req, res) => {


        log(req.body)
        if (req.body.eventName === 'joinedRoom') {

            const user_id = req.body.data.user_id
            const room_id = req.body.data.room_id
            if (Object.keys(sockets).includes(user_id)) {
                sockets[user_id].join(`room-${room_id}`)

            }


        } else {
            io.to(req.body.channel).emit(req.body.eventName, req.body.data);

        }


        return res.json('Data received')
    })
}


export default router;

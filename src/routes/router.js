import {log} from "../../packages/logger.js";
import {findClient, getClients} from "../../packages/utils.js";

const router = (router, io) => {
    router.get('/', (req, res) => {
        return res.json('Chat is ready')
    })


    router.get('/sockets/:userId', async (req, res) => {
        const userId = req.params.userId

        const client = await findClient(io, userId)


        if (client !== undefined) {
            return res.json(client.rooms)

        }
        return res.json('Not Found')

    })
    router.get('/sockets', async (req, res) => {

        const data = []


        const clients = await getClients(io)


        clients.map(client => {
            data.push({
                id: client.user_id, socket_id: client.id, username: client.username, rooms: Array.from(client.rooms),
            })
        })

        return res.json(data)
    })

    router.post('/emit', async (req, res) => {

return 'ok';
        log(req.body)

        io.to(req.body.channel).emit(req.body.eventName, req.body.data);



        return res.json('Data received')
    })



    router.post('/joinToRoom', async (req, res) => {

        // return 'ok';

        log('User Joined',req.body)
        const user_id = req.body.data.user_id
        const room_id = req.body.data.room_id


        const client = await findClient(io, user_id)
        if (client !== undefined) {




            for (const room of client.rooms) {

                if (room.includes('room')) {
                    await client.leave(room)
                }
            }

            client.join(`room-${room_id}`)
        }


        return res.json('User Joined')
    })

}


export default router;

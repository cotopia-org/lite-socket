import {log} from "../../packages/logger.js";
import {findClient, findClientBySocketId, getClients} from "../../packages/utils.js";


const listener = (redisClient, io) => {
    redisClient.pSubscribe("lite-redis-socket", function (data) {

        const msg = JSON.parse(data);


        log(msg)

        io.to(msg.channel).emit(msg.eventName, msg.data);


    });


    redisClient.pSubscribe("lite-redis-joined", async function (data) {

        const msg = JSON.parse(data);


        const socket_id = msg.socket_id
        const room_id = msg.room_id


        const client = await findClientBySocketId(io, socket_id)

        if (client !== undefined) {


            for (const room of client.rooms) {

                if (room.includes('room')) {
                    await client.leave(room)
                }
            }

            client.join(`room-${room_id}`)
        }


    });

    redisClient.pSubscribe("lite-redis-chat-created", async function (data) {

        const msg = JSON.parse(data);


        const user_id = msg.user_id
        const chat_id = msg.chat_id


        const client = await findClient(io, user_id)
        if (client !== undefined) {


            client.join(`chat-${chat_id}`)
        }


    });
}


export default listener
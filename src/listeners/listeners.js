import {log} from "../../packages/logger.js";
import {findClient, getClients} from "../../packages/utils.js";


const listener = (redisClient, io) => {
    redisClient.pSubscribe("lite-redis-socket", function (data) {

        const msg = JSON.parse(data);


        log(msg)

        io.to(msg.channel).emit(msg.eventName, msg.data);


    });
}


export default listener
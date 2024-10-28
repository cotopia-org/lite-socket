import {log} from "../../packages/logger.js";
import {findClient, getClients} from "../../packages/utils.js";


const listener = (redisClient,io)=>{
    redisClient.pSubscribe("lite-redis-test-channel", function (data, channel) {
        console.log('Got message from ' + channel,data);



        log(JSON.parse(data.data))

        io.to(data.channel).emit(channel, JSON.parse(data.data));



    });
}


export default listener
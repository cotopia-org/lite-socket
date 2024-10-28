import {log} from "../../packages/logger.js";
import {findClient, getClients} from "../../packages/utils.js";


const listener = (redisClient,io)=>{
    redisClient.pSubscribe("test-channel", function (data, channel) {
        console.log('Got message from ' + channel,data);



        log(data)

        io.to(data.channel).emit(channel, data.data);



    });
}


export default listener
import axiosInstance from "../../packages/axios.js";
import {log} from "../../packages/logger.js";


export default function messagesRegister(socket, authToken) {

    function sendRequest(method,url,data,token = authToken,socket_id = socket.id){

        axiosInstance.request({
            url:url,
            method:method,
            data:data,
            headers:{'Authorization': `Bearer ${token}`,'Socket-Id':socket_id}
        })
    }

    socket.on("sendMessage", (data, callback) => {

        log('sendMessage', data)


        try {
            callback(data);

        } catch (e) {
            log(e)
        }
        socket.to('chat-' + data.chat_id).emit('messageReceived', data);
        log('messageReceived', data)


        sendRequest('post','/messages',data)

    });


    socket.on("isTyping", (data) => {

        log('isTyping', data)


        socket.to('chat-' + data.chat_id).emit('isTyping', data);


    });

    socket.on("pinMessage", (data, callback) => {

        log('pinMessage', data)
        socket.to('chat-' + data.chat_id).emit('messagePinned', data);
        callback(data);


        sendRequest('get','/messages/' + data.nonce_id + '/pin')




    });

    socket.on("unPinMessage", (data, callback) => {

        log('unPinMessage', data)
        socket.to('chat-' + data.chat_id).emit('messageUnPinned', data);
        callback(data);

        sendRequest('get','/messages/' + data.nonce_id + '/unPin')



    });


    socket.on("deleteMessage", (data, callback) => {

        log('deleteMessage', data)
        socket.to('chat-' + data.chat_id).emit('messageDeleted', data);
        callback(data);

        sendRequest('delete','/messages/' + data.nonce_id )


    });

    socket.on('seenMessage', data => {
        log('seenMessage', data)


        socket.to('chat-' + data.chat_id).emit('messageSeen', data);

        sendRequest('get','/messages/' + data.nonce_id + '/seen')


    })
    socket.on("updateMessage", (data, callback) => {

        log('updateMessage', data)


        callback(data);
        socket.to('chat-' + data.chat_id).emit('messageUpdated', data);

        sendRequest('put','/messages/' + data.nonce_id,data)


    });


}




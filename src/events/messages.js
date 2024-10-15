import axiosInstance from "../../packages/axios.js";
import {log} from "../../packages/logger.js";


export default function messagesRegister(socket, authToken) {


    socket.on("sendMessage", (data, callback) => {

        log('sendMessage', data)


        try {
            callback(data);

        } catch (e) {
            log(e)
        }
        socket.to('chat-' + data.chat_id).emit('messageReceived', data);
        log('messageReceived', data)


        axiosInstance.post('/messages', data, {'headers': {'Authorization': `Bearer ${authToken}`}})

    });


    socket.on("isTyping", (data) => {

        log('isTyping', data)


        socket.to('chat-' + data.chat_id).emit('isTyping', data);


    });

    socket.on("pinMessage", (data, callback) => {

        log('pinMessage', data)
        socket.to('chat-' + data.chat_id).emit('messagePinned', data);
        callback(data);

        axiosInstance.get('/messages/' + data.nonce_id + '/pin', {'headers': {'Authorization': `Bearer ${authToken}`}})


    });

    socket.on("unPinMessage", (data, callback) => {

        log('unPinMessage', data)
        socket.to('chat-' + data.chat_id).emit('messageUnPinned', data);
        callback(data);

        axiosInstance.get('/messages/' + data.nonce_id + '/unPin', {'headers': {'Authorization': `Bearer ${authToken}`}})


    });


    socket.on("deleteMessage", (data, callback) => {

        log('deleteMessage', data)
        socket.to('chat-' + data.chat_id).emit('messageDeleted', data);
        callback(data);

        axiosInstance.delete('/messages/' + data.nonce_id, {'headers': {'Authorization': `Bearer ${authToken}`}})


    });

    socket.on('seenMessage', data => {
        log('seenMessage', data)


        socket.to('chat-' + data.chat_id).emit('messageSeen', data);

        axiosInstance.get('/messages/' + data.nonce_id + '/seen', {'headers': {'Authorization': `Bearer ${authToken}`}})


    })
    socket.on("updateMessage", (data, callback) => {

        log('updateMessage', data)


        callback(data);
        socket.to('chat-' + data.chat_id).emit('messageUpdated', data);

        axiosInstance.put('/messages/' + data.nonce_id, data, {'headers': {'Authorization': `Bearer ${authToken}`}})


    });


}




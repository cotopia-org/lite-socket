import axiosInstance from "../app/axios.js";
import {log} from "../app/logger.js";


const event = (socket, authToken) => {


    socket.on("sendMessage", (data, callback) => {

        log('sendMessage', data)


        try {
            callback(data);

        } catch (e) {
            log(e)
        }
        socket.to(data.channel).emit('messageReceived', data);
        log('messageReceived', data)


        axiosInstance.post('/messages', data, {'headers': {'Authorization': `Bearer ${authToken}`}})

    });


    socket.on("isTyping", (data) => {

        log('isTyping', data)


        socket.to(data.channel).emit('isTyping', data);


    });

    socket.on("pinMessage", (data, callback) => {

        log('pinMessage', data)
        socket.to(data.channel).emit('messagePinned', data);
        callback(data);

        axiosInstance.get('/messages/' + data.nonce_id + '/pin', {'headers': {'Authorization': `Bearer ${authToken}`}})


    });

    socket.on("unPinMessage", (data, callback) => {

        log('unPinMessage', data)
        socket.to(data.channel).emit('messageUnPinned', data);
        callback(data);

        axiosInstance.get('/messages/' + data.nonce_id + '/unPin', {'headers': {'Authorization': `Bearer ${authToken}`}})


    });


    socket.on("deleteMessage", (data, callback) => {

        log('deleteMessage', data)
        socket.to(data.channel).emit('messageDeleted', data);
        callback(data);

        axiosInstance.delete('/messages/' + data.nonce_id, {'headers': {'Authorization': `Bearer ${authToken}`}})


    });

    socket.on('seenMessage', data => {
        log('seenMessage', data)


        socket.to(data.channel).emit('messageSeen', data);

        axiosInstance.get('/messages/' + data.nonce_id + '/seen', {'headers': {'Authorization': `Bearer ${authToken}`}})


    })
    socket.on("updateMessage", (data, callback) => {

        log('updateMessage', data)


        callback(data);
        socket.to(data.channel).emit('messageUpdated', data);

        axiosInstance.put('/messages/' + data.nonce_id, data, {'headers': {'Authorization': `Bearer ${authToken}`}})


    });

    socket.on('joinedRoom', (data, cb) => {
        log('joinedRoom', data)


        socket.rooms.forEach(async a => {

            if (a.includes('room')) {
                await socket.leave(a)
            }
        })
        socket.join(`room-${data}`)


        socket.emit('joinedInRoom', true)


        try {
            cb(data);

        } catch (e) {
            log(e)
        }


    })

    socket.on('updateCoordinates', data => {
        log('updateCoordinates', data)


        socket.to('room-' + data.room_id).emit('updateCoordinates', data);

        axiosInstance.post('/updateCoordinates', {
            coordinates: data.coordinates,
        }, {'headers': {'Authorization': `Bearer ${authToken}`}})


    })


    socket.on('leaveRoom', () => {
        log('leaveRoom')


        axiosInstance.get('/disconnected', {'headers': {'Authorization': `Bearer ${authToken}`}})


    })


}


export default event;


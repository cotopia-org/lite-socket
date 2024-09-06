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
        socket.to('room-' + data.room_id).emit('messageReceived', data);
        log('messageReceived', data)


        axiosInstance.post('/messages', data, {'headers': {'Authorization': `Bearer ${authToken}`}})

    });

    socket.on("pinMessage", (data, callback) => {

        log('pinMessage', data)
        socket.to('room-' + data.room_id).emit('messagePinned', data);
        callback(data);

        axiosInstance.get('/messages/' + data.nonce_id + '/pin', {'headers': {'Authorization': `Bearer ${authToken}`}})


    });

    socket.on("unPinMessage", (data, callback) => {

        log('unPinMessage', data)
        socket.to('room-' + data.room_id).emit('messageUnPinned', data);
        callback(data);

        axiosInstance.get('/messages/' + data.nonce_id + '/unPin', {'headers': {'Authorization': `Bearer ${authToken}`}})


    });


    socket.on("deleteMessage", (data, callback) => {

        log('deleteMessage', data)
        socket.to('room-' + data.room_id).emit('messageDeleted', data);
        callback(data);

        axiosInstance.delete('/messages/' + data.nonce_id, {'headers': {'Authorization': `Bearer ${authToken}`}})


    });

    socket.on('seenMessage', data => {
        log('seenMessage', data)


        socket.to('room-' + data.room_id).emit('messageSeen', data);

        axiosInstance.get('/messages/' + data.nonce_id + '/seen', {'headers': {'Authorization': `Bearer ${authToken}`}})


    })
    socket.on("updateMessage", (data, callback) => {

        log('updateMessage', data)


        callback(data);
        socket.to('room-' + data.room_id).emit('messageUpdated', data);

        axiosInstance.put('/messages/' + data.nonce_id, data, {'headers': {'Authorization': `Bearer ${authToken}`}})


    });

    socket.on('joinedRoom', data => {
        log('joinedRoom', data)


        socket.rooms.forEach(async a => {

            if (a.includes('room')) {
                await socket.leave(a)
            }
        })
        socket.join(`room-${data}`)


        socket.emit('joinedInRoom', true)

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


import axiosInstance from "../app/axios.js";
import {log} from "../app/logger.js";


const event = (socket, authToken) => {


    socket.on('roomMessages', data => {
        console.log(data)

        //
        // axiosInstance.get('http://localhost:8000/').then((response) => {
        //     console.log(response)
        // })
    })


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


    socket.on('seenMessage', data => {
        log('seenMessage', data)


        socket.to('room-' + data.room_id).emit('messageSeen', data);

        axiosInstance.get('/messages/' + data.message_id + '/seen', {'headers': {'Authorization': `Bearer ${authToken}`}})


    })


    socket.on('leaveRoom', () => {
        log('leaveRoom')


        axiosInstance.get('/disconnected', {'headers': {'Authorization': `Bearer ${authToken}`}})


    })


}


export default event;


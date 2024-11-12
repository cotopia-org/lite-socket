import axiosInstance from "../../packages/axios.js";
import {log} from "../../packages/logger.js";

export default function usersRegister(socket, authToken) {

    function sendRequest(method,url,data,token = authToken,socket_id = socket.id){

        axiosInstance.request({
            url:url,
            method:method,
            data:data,
            headers:{'Authorization': `Bearer ${token}`,'Socket-Id':socket_id}
        })
    }
    socket.on('joinedRoom', (data, cb) => {
        log('joinedRoom', data)


        socket.rooms.forEach(async a => {

            if (a.includes('room')) {
                await socket.leave(a)
            }
        })
        socket.join(`room-${data}`)


        socket.emit('joinedInRoom', true)


        cb(data);



    })

    socket.on('updateCoordinates', data => {
        log('updateCoordinates', data)


        socket.to('room-' + data.room_id).emit('updateCoordinates', data);


        sendRequest('post','/updateCoordinates',{
            coordinates: data.coordinates,
        },)


    })


    socket.on('updateShareScreenCoordinates', data => {
        log('updateShareScreenCoordinates', data)


        socket.to('room-' + data.room_id).emit('updateShareScreenCoordinates', data);

        // axiosInstance.post('/updateCoordinates', {
        //     coordinates: data.coordinates,
        // }, {'headers': {'Authorization': `Bearer ${authToken}`}})


    })


    socket.on('updateShareScreenSize', data => {
        log('updateShareScreenSize', data)


        socket.to('room-' + data.room_id).emit('updateShareScreenSize', data);

        // axiosInstance.post('/updateCoordinates', {
        //     coordinates: data.coordinates,
        // }, {'headers': {'Authorization': `Bearer ${authToken}`}})


    })


    // socket.on('leaveRoom', () => {
    //     log('leaveRoom')
    //
    //
    //     axiosInstance.get('/disconnected', {'headers': {'Authorization': `Bearer ${authToken}`}})
    //
    //
    // })


}




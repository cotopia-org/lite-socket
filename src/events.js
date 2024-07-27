import axiosInstance from "../app/axios.js";

const event = (socket) => {


    socket.on('roomMessages', data => {
        console.log(data)

        //
        // axiosInstance.get('http://localhost:8000/').then((response) => {
        //     console.log(response)
        // })
    })


    socket.on('updateCoordinate', data => {
        console.log(data)

        //
        // axiosInstance.get('http://localhost:8000/').then((response) => {
        //     console.log(response)
        // })
    })
}


export default event;


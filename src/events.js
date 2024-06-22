import axiosInstance from "../app/axios.js";

const event = (socket) => {


    socket.broadcast.emit("message", "welcome");

    socket.on('message', data => {
        console.log(data)

        //
        // axiosInstance.get('http://localhost:8000/').then((response) => {
        //     console.log(response)
        // })
    })
}


export default event;


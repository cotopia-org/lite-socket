import axios from "axios";


// Create a new Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:8000/api/socket',
    headers: {
        ["Content-Type"]: "application/json",
    },
});


export default axiosInstance;

import axios from "axios";


// Create a new Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:8000/api/socket',
    headers: {
        ["Content-Type"]: "application/json",
    },
});


axiosInstance.interceptors.response.use(res => {
    return Promise.resolve(res);


}, error => {
    console.log(error)
    return error;
})

export default axiosInstance;

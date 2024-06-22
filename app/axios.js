import axios from "axios";


// Create a new Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        ["Content-Type"]: "application/json",
    },
});

// Add a request interceptor to add authorization headers
axiosInstance.interceptors.request.use(
    (config) => {

        const accessToken = process.env.ACCESS_TOKEN;
        if (accessToken && config.headers) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default axiosInstance;

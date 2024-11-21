import axiosInstance from "./axios.js";


export const log = (...args) => {
    console.log('\x1b[2m%s\x1b[0m', new Date().toISOString(), args)

    axiosInstance.post('/logger', args)


}
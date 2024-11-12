import axiosInstance from "./axios.js";

export async function findClient(io, id) {
    const clients = await io.fetchSockets();

    return clients.find(client => client.user_id === id)

}


export async function getClients(io) {
    return await io.fetchSockets();


}
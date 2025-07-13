import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3030',
    timeout: 10000,
})

api.interceptors.request.use((config) => {
    return config
})

api.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    console.log(error, 'error')
    return Promise.reject(error)
})

export default api
import axios from "axios";
import Cookies from 'js-cookie';


const api = axios.create({
    baseURL: 'http://localhost:3030',
    timeout: 10000,
})

// 请求拦截器
api.interceptors.request.use((config) => {
    const token = Cookies.get('AICHAT') || localStorage.getItem('token');
    // 添加token
    config.headers.Authorization = `Bearer ${token}`;
    return config
})

// 响应拦截器
api.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    console.log(error, 'error')
    return Promise.reject(error)
})

export default api
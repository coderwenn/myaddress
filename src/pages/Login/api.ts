import api from '@/utils/netWork/index'
export function addUser<T>(data: {
    username: string,
    password: string
}): Promise<T>{
    return api.post('/addUser', data)
}
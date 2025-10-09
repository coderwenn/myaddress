import request from '@/utils/netWork'

export function getUserToken(mes: string): Promise<{
    code: number,
    data: {
        token: string
    }
    msg: string
}> {
    return request.post('/user/login', mes)
}
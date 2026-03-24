import request from '@/utils/netWork'

export function getUserToken(mes: string): Promise<{
    code: number,
    data: {
        access_token: string,
        user: {
            sub: number,
            account: string,
            is_admin: boolean,
            has_backoffice: boolean
        }
    }
    msg: string
}> {
    return request.post('/auth/login', {
        account: mes.username,
        password: mes.password
    })
}

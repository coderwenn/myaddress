import { create } from 'zustand'
// 同步用户信息到本地缓存
import { createJSONStorage, persist } from 'zustand/middleware'

type userInfoType = {
    name: string,
    avatar: string,
}


const useUserInfo = create(
    persist<userInfoType>(
        (set, get) => {
            console.log('get', get(),set);
            return {
                name: '',
                avatar: '',
            }
        },
        {
            name: 'userInfo',
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export default useUserInfo
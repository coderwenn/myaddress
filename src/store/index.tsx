import { create } from 'zustand'
// 同步用户信息到本地缓存
import { persist } from 'zustand/middleware'


const useUserInfo = create(
    persist<{
        userInfo: any,
        setUserInfo: (userInfo: any) => void,
    }>(
        (set) => (
            {
                userInfo: {},
                setUserInfo: (userInfo: any) => {
                    set({ userInfo })
                }
            }
        ), {
        name: 'userInfo'
    }
    )
)

export default useUserInfo
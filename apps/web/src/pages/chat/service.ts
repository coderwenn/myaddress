import { api } from "@/utils";
import { conversationItem, imgSuccessItem, imgTaskItem } from './type'

// 请求图片的taskId
export function getImgTask(mes: string) {
    return api.post<imgTaskItem>('/ai/aiPicture', {
        message: mes
    },)
}

// 根据taskId请求图片地址
export function getImgUrl(taskid: string) {
    return api.get<imgSuccessItem>(`/ai/aiGetUrl?taskid=${taskid}`)
}

// 获取当前user的对话列表
export function getConversationList<T = any>(): Promise<{ code: string, data: T, msg: string }> {
    return api.post('/conversation/list')
}

// 新增对话
export function addConversation<T = any>(params: conversationItem): Promise<{ code: string, data: T, msg: string }> {
    return api.post('/conversation/create', params)
}

// 根据id查看对话list
export function getConversationDetail<T = any>(params: { conversation_id: number }): Promise<{ code: string, data: T, msg: string }> {
    return api.post('/conversation/list', params)
}


// 获取对话列表
// export function getConversationDetail<T = any>(params: { conversation_id: number }): Promise<{ code: string, data: T, msg: string }> {
//     return api.post('/conversation/list', params)
// }
import { api } from "@/utils";
import { imgSuccessItem, imgTaskItem } from './type'

// 请求图片的taskId
export function getImgTask(mes: string) {
    return api.post<imgTaskItem>('/aiPicture', {
        message: mes
    },)
}

// 根据taskId请求图片地址
export function getImgUrl(taskid: string) {
    return api.get<imgSuccessItem>(`/aiGetUrl?taskid=${taskid}`)
}
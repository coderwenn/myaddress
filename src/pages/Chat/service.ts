import { api } from "@/utils";

// 请求图片的taskId
export function getImgTask(mes: string) {
    return api.post<{
        "output": {
            "task_status": string,
            "task_id": string
        },
        "request_id": string
    }>('/aiPicture', {
        message: mes
    },)
}

// 根据taskId请求图片地址
export function getImgUrl(taskid: string) {
    return api.get<{
        "request_id": "f767d108-7d50-908b-a6d9-xxxxxx",
        "output": {
            "task_id": string,
            "task_status": string,
            "submit_time": string,
            "scheduled_time": string,
            "end_time": string,
            "results": [
                {
                    "orig_prompt": string,
                    "actual_prompt": string,
                    "url": string
                }
            ],
            "task_metrics": {
                "TOTAL": number,
                "SUCCEEDED": number,
                "FAILED": number
            }
        },
        "usage": {
            "image_count": number
        }
    }>(`/aiGetUrl?taskid=${taskid}`)
}
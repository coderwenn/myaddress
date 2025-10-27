export type messageItem = {
    id: number,
    content: string,
    isUser: boolean,
}

export enum MESSAGE_TYPE {
    IMGAGE = 'img',
    TEXT = 'text'
}

// 图片请求返回值
export type imgTaskItem = {
    output: {
        task_status: string,
        task_id: string
    },
    request_id: string
}


// 图片请求成功返回值
export type imgSuccessItem = {
    request_id: string,
    output: {
        task_id: string,
        task_status: string,
        submit_time: string,
        scheduled_time: string,
        end_time: string,
        results: [
            {
                orig_prompt: string,
                actual_prompt: string,
                url: string
            }
        ],
        task_metrics: {
            TOTAL: number,
            SUCCEEDED: number,
            FAILED: number
        }
    },
    usage: {
        image_count: number
    }
}
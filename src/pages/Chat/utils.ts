import { messageItem } from "./type";

//  crypto.randomUUID()
export function getMessage(content: string): messageItem {
    return {
        id: crypto.randomUUID(),
        content,
        isUser: true,
    }
}

export function getAiMessage(content: string): messageItem {
    return {
        id: crypto.randomUUID(),
        content,
        isUser: false,
    }
}
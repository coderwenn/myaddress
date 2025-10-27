import { useState } from 'react';
import { messageItem } from '../type';
type messListType = {
    text: Array<messageItem>
    img: Array<messageItem>
}

type mltKey = keyof messListType

const useChatConfig = () => {
    const [messList, setMesList] = useState<messListType>({
        text: [],
        img: []
    })
    const [aiType, setAitype] = useState<mltKey>('text');

    // todo 待完善方法 发送信息的方法
    const sendMessage = (message: string) => {
        setMesList(prev => ({
            ...prev,
            [aiType]: [...prev[aiType], {
                id: Date.now() + Math.random(),
                content: message,
                isUser: true,
            }]
        }))
    }


    return {
        messList,
        setMesList,
        aiType,
        setAitype,
        sendMessage
    }

}

export default useChatConfig;
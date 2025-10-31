import { useState } from 'react';
import { messageItem } from '../type';
import { fetchEventSource } from '@microsoft/fetch-event-source';
type messListType = {
    text: Array<messageItem>
    img: Array<messageItem>
}

type mltKey = keyof messListType
const abortController = new AbortController();
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
    function fetchEventData(
        url: string,
        onSucceed: (data: string) => void,
        onError: (error: Error) => void
    ) {
        fetchEventSource(
            url, {
            method: 'GET',
            headers: {
                Accept: "text/event-stream",
            },
            signal: abortController.signal,
            onmessage(event) {
                if (event.data === '[DONE]') {
                    abortController.abort();
                    return;
                }
                onSucceed(event.data)
                console.log(event)
            },
            onerror(error) {
                console.error(`fetchEventData: ${error}`)
                onError(error);
            }
        })
    }


    return {
        messList,
        setMesList,
        aiType,
        setAitype,
        sendMessage,
        fetchEventData
    }

}

export default useChatConfig;
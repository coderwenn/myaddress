import { useEffect, useState } from 'react';
import { conversationItem, conversationListType, messageItem } from '../type';
import { fetchEventSource } from '@microsoft/fetch-event-source';

import { addConversation, getConversationList } from '../service';
import { title } from 'process';

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
  const [conversationList, setConversationList] = useState<{
    list: Array<conversationListType>
    total: number
  }>({
    list: [],
    total: 0
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
      },
      onerror(error) {
        console.error(`fetchEventData: ${error}`)
        onError(error);
      }
    })
  }

  // 新增对话
  function addNewConversation(title: string) {
    addConversation({
      title: title || '新对话',
      content: '测试新对话',
      ai_response: '测试新对话'
    }).then(res => {
      console.log(res, '新增对话')
      // 重新获取对话列表
      getConversationList().then(res => {
        setConversationList(res.data)
      })
    })
  }

  useEffect(() => {
    // 初始化时获取对话列表
    getConversationList().then(res => {
      console.log(res, '对话列表')
      setConversationList(res.data)
    })
  }, [])

  return {
    messList,
    setMesList,
    aiType,
    setAitype,
    sendMessage,
    fetchEventData,
    addNewConversation,
    conversationList,
  }

}

export default useChatConfig;
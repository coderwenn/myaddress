import { useCallback, useEffect, useRef, useState } from 'react';
import { conversationListType, messageItem } from '../type';
import { fetchEventSource } from '@microsoft/fetch-event-source';

import { addConversation, getConversationDetail, getConversationList, getImgTask, getImgUrl } from '../service';
import { getAiMessage, getMessage } from '../utils';

type messListType = {
  text: Array<messageItem>
  img: Array<messageItem>
}

type mltKey = keyof messListType
const url = import.meta.env.VITE_API_CHATURL

const useChatConfig = () => {
  const [conversationList, setConversationList] = useState<{
    list: Array<conversationListType>
    total: number
  }>({
    list: [],
    total: 0
  })
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, messListType>>({});
  const [sendingByConversation, setSendingByConversation] = useState<Record<string, Record<mltKey, boolean>>>({});

  const streamControllersRef = useRef<Record<string, AbortController>>({});
  const pollTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const inFlightMessageRef = useRef<Record<string, Partial<Record<mltKey, string>>>>({});
  const lastPromptRef = useRef<Record<string, Partial<Record<mltKey, string>>>>({});
  const isMountedRef = useRef(true);

  const createEmptyBucket = () => ({ text: [], img: [] } as messListType);
  const getConversationKey = (conversationId: number) => String(conversationId);

  const setSendingState = useCallback((conversationId: number, type: mltKey, sending: boolean) => {
    const key = getConversationKey(conversationId);
    setSendingByConversation(prev => ({
      ...prev,
      [key]: {
        text: prev[key]?.text ?? false,
        img: prev[key]?.img ?? false,
        [type]: sending,
      }
    }))
  }, [])

  const appendMessage = useCallback((conversationId: number, type: mltKey, message: messageItem) => {
    const key = getConversationKey(conversationId);
    setMessagesByConversation(prev => {
      const bucket = prev[key] ?? createEmptyBucket();
      return {
        ...prev,
        [key]: {
          ...bucket,
          [type]: [...bucket[type], message],
        }
      }
    })
  }, [])

  const upsertMessage = useCallback((conversationId: number, type: mltKey, message: messageItem) => {
    const key = getConversationKey(conversationId);
    setMessagesByConversation(prev => {
      const bucket = prev[key] ?? createEmptyBucket();
      const list = bucket[type];
      const index = list.findIndex(item => item.id === message.id);
      const nextList = index === -1
        ? [...list, message]
        : list.map(item => item.id === message.id ? message : item);
      return {
        ...prev,
        [key]: {
          ...bucket,
          [type]: nextList,
        }
      }
    })
  }, [])

  const startStream = useCallback((key: string, streamUrl: string, onChunk: (data: string) => void, onDone: () => void, onError: (error: Error) => void) => {
    if (streamControllersRef.current[key]) {
      streamControllersRef.current[key].abort();
    }
    const controller = new AbortController();
    streamControllersRef.current[key] = controller;

    fetchEventSource(streamUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
      },
      signal: controller.signal,
      onmessage(event) {
        if (event.data === '[DONE]') {
          controller.abort();
          delete streamControllersRef.current[key];
          onDone();
          return;
        }
        onChunk(event.data);
      },
      onerror(error) {
        controller.abort();
        delete streamControllersRef.current[key];
        console.error(`fetchEventData: ${error}`);
        onError(error);
      }
    })
  }, [])

  const normalizeConversationMessages = (data: any): messListType => {
    const bucket = createEmptyBucket();
    if (!data) return bucket;

    const pushPair = (content?: string, aiResponse?: string) => {
      if (content) bucket.text.push({ ...getMessage(content) });
      if (aiResponse) bucket.text.push({ ...getAiMessage(aiResponse) });
    }

    const pushMessage = (content: string, isUser: boolean, type: mltKey = 'text') => {
      bucket[type].push({ id: crypto.randomUUID(), content, isUser });
    }

    const normalizeItem = (item: any) => {
      if (!item) return;
      if (item.content && item.ai_response) {
        pushPair(item.content, item.ai_response);
        return;
      }
      if (typeof item.content === 'string') {
        const role = item.role || (item.isUser ? 'user' : 'assistant');
        const type = item.type === 'img' || item.contentType === 'img' ? 'img' : 'text';
        pushMessage(item.content, role === 'user', type);
        return;
      }
      if (typeof item.ai_response === 'string') {
        pushMessage(item.ai_response, false, 'text');
      }
    }

    if (Array.isArray(data)) {
      data.forEach(normalizeItem);
      return bucket;
    }
    if (Array.isArray(data.list)) {
      data.list.forEach(normalizeItem);
      return bucket;
    }
    if (Array.isArray(data.messages)) {
      data.messages.forEach(normalizeItem);
      return bucket;
    }
    if (typeof data.content === 'string' || typeof data.ai_response === 'string') {
      normalizeItem(data);
    }
    return bucket;
  }

  const refreshConversationList = useCallback(async () => {
    const res = await getConversationList();
    if (!res?.data) return;
    setConversationList(res.data);
    const list = res.data.list || [];
    if (list.length > 0) {
      setActiveConversationId(prev => {
        if (prev && list.some(item => item.id === prev)) return prev;
        return list[0].id;
      })
    }
  }, [])

  // 新增对话
  const addNewConversation = useCallback(async (title: string) => {
    const res = await addConversation({
      title: title || 'New Conversation',
      content: '',
      ai_response: ''
    })
    const createdId = res?.data?.id ?? res?.data?.conversation_id ?? null;
    await refreshConversationList();
    if (createdId) {
      setActiveConversationId(createdId);
    }
    return createdId;
  }, [refreshConversationList])
  const loadConversationMessages = useCallback(async (conversationId: number) => {
    try {
      const res = await getConversationDetail({ conversation_id: conversationId });
      if (!res?.data) return;
      const normalized = normalizeConversationMessages(res.data);
      setMessagesByConversation(prev => ({
        ...prev,
        [getConversationKey(conversationId)]: normalized,
      }))
    } catch (error) {
      console.error('loadConversationMessages error', error);
    }
  }, [])

  const ensureActiveConversation = useCallback(async (conversationId?: number | null) => {
    if (conversationId) return conversationId;
    if (activeConversationId) return activeConversationId;
    if (conversationList.list.length > 0) {
      setActiveConversationId(conversationList.list[0].id);
      return conversationList.list[0].id;
    }
    const createdId = await addNewConversation('New Conversation');
    return createdId;
  }, [activeConversationId, conversationList.list, addNewConversation])

  const sendTextMessage = useCallback(async (message: string, conversationId?: number | null) => {
    const ensuredId = await ensureActiveConversation(conversationId);
    if (!ensuredId) return false;
    const key = getConversationKey(ensuredId);
    lastPromptRef.current[key] = {
      ...lastPromptRef.current[key],
      text: message,
    };
    const userMessage = getMessage(message);
    appendMessage(ensuredId, 'text', userMessage);

    const aiMessage = getAiMessage('', { loading: true });
    inFlightMessageRef.current[key] = {
      ...inFlightMessageRef.current[key],
      text: String(aiMessage.id),
    };
    appendMessage(ensuredId, 'text', aiMessage);
    setSendingState(ensuredId, 'text', true);

    const streamKey = `${ensuredId}:text`;
    const streamUrl = `${url}/ai/aiChat?message=${encodeURIComponent(message)}`;

    return new Promise<boolean>((resolve) => {
      startStream(
        streamKey,
        streamUrl,
        (data) => {
          let value = '';
          try {
            value = JSON.parse(data)?.content ?? '';
          } catch {
            value = data;
          }
          aiMessage.content += value;
          aiMessage.loading = true;
          upsertMessage(ensuredId, 'text', { ...aiMessage });
        },
        () => {
          aiMessage.loading = false;
          upsertMessage(ensuredId, 'text', { ...aiMessage });
          setSendingState(ensuredId, 'text', false);
          resolve(true);
        },
        () => {
          aiMessage.loading = false;
          upsertMessage(ensuredId, 'text', { ...aiMessage });
          setSendingState(ensuredId, 'text', false);
          resolve(false);
        }
      )
    })
  }, [appendMessage, ensureActiveConversation, setSendingState, startStream, upsertMessage])

  const sendImageMessage = useCallback(async (message: string, conversationId?: number | null) => {
    const ensuredId = await ensureActiveConversation(conversationId);
    if (!ensuredId) return false;
    const key = getConversationKey(ensuredId);
    lastPromptRef.current[key] = {
      ...lastPromptRef.current[key],
      img: message,
    };
    const userMessage = getMessage(message);
    appendMessage(ensuredId, 'img', userMessage);

    const aiMessage = getAiMessage('', { loading: true });
    inFlightMessageRef.current[key] = {
      ...inFlightMessageRef.current[key],
      img: String(aiMessage.id),
    };
    appendMessage(ensuredId, 'img', aiMessage);
    setSendingState(ensuredId, 'img', true);

    const pollKey = `${ensuredId}:img`;
    if (pollTimersRef.current[pollKey]) {
      clearTimeout(pollTimersRef.current[pollKey]);
    }

    try {
      const taskRes = await getImgTask(message);
      const taskId = taskRes?.data?.output?.task_id;
      if (!taskId) {
        aiMessage.loading = false;
        upsertMessage(ensuredId, 'img', { ...aiMessage, content: 'Image task failed.' });
        setSendingState(ensuredId, 'img', false);
        return false;
      }

      const poll = async () => {
        try {
          const imgRes = await getImgUrl(taskId);
          if (imgRes?.data?.usage?.image_count === 1) {
            const imageUrl = imgRes.data.output.results[0].url;
            aiMessage.loading = false;
            upsertMessage(ensuredId, 'img', { ...aiMessage, content: imageUrl });
            setSendingState(ensuredId, 'img', false);
            return;
          }
          if (!isMountedRef.current) return;
          pollTimersRef.current[pollKey] = setTimeout(poll, 2000);
        } catch (error) {
          aiMessage.loading = false;
          upsertMessage(ensuredId, 'img', { ...aiMessage, content: 'Image task failed.' });
          setSendingState(ensuredId, 'img', false);
        }
      }

      poll();
      return true;
    } catch (error) {
      aiMessage.loading = false;
      upsertMessage(ensuredId, 'img', { ...aiMessage, content: 'Image task failed.' });
      setSendingState(ensuredId, 'img', false);
      return false;
    }
  }, [appendMessage, ensureActiveConversation, setSendingState, upsertMessage])

  useEffect(() => {
    // 初始化时获取对话列表
    refreshConversationList();
  }, [refreshConversationList])

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      Object.values(streamControllersRef.current).forEach(controller => controller.abort());
      Object.values(pollTimersRef.current).forEach(timer => clearTimeout(timer));
    }
  }, [])

  useEffect(() => {
    if (!activeConversationId) return;
    const key = getConversationKey(activeConversationId);
    if (messagesByConversation[key]) return;
    loadConversationMessages(activeConversationId);
  }, [activeConversationId, loadConversationMessages, messagesByConversation])

  const isSending = useCallback((conversationId: number | null | undefined, type: mltKey) => {
    if (!conversationId) return false;
    const key = getConversationKey(conversationId);
    return Boolean(sendingByConversation[key]?.[type]);
  }, [sendingByConversation])

  const stopSending = useCallback((conversationId: number | null | undefined, type: mltKey) => {
    if (!conversationId) return;
    const key = getConversationKey(conversationId);
    const streamKey = `${conversationId}:${type}`;
    if (streamControllersRef.current[streamKey]) {
      streamControllersRef.current[streamKey].abort();
      delete streamControllersRef.current[streamKey];
    }
    if (pollTimersRef.current[streamKey]) {
      clearTimeout(pollTimersRef.current[streamKey]);
      delete pollTimersRef.current[streamKey];
    }
    const messageId = inFlightMessageRef.current[key]?.[type];
    if (messageId) {
      upsertMessage(conversationId, type, {
        id: messageId,
        content: 'Canceled.',
        isUser: false,
        loading: false,
      })
    }
    setSendingState(conversationId, type, false);
  }, [setSendingState, upsertMessage])

  const retryLast = useCallback(async (conversationId: number | null | undefined, type: mltKey) => {
    if (!conversationId) return false;
    const key = getConversationKey(conversationId);
    const prompt = lastPromptRef.current[key]?.[type];
    if (!prompt) return false;
    if (type === 'text') {
      return sendTextMessage(prompt, conversationId);
    }
    return sendImageMessage(prompt, conversationId);
  }, [sendImageMessage, sendTextMessage])

  const hasLastPrompt = useCallback((conversationId: number | null | undefined, type: mltKey) => {
    if (!conversationId) return false;
    const key = getConversationKey(conversationId);
    return Boolean(lastPromptRef.current[key]?.[type]);
  }, [])

  return {
    activeConversationId,
    setActiveConversationId,
    messagesByConversation,
    isSending,
    sendTextMessage,
    sendImageMessage,
    stopSending,
    retryLast,
    hasLastPrompt,
    addNewConversation,
    conversationList,
    refreshConversationList,
  }

}

export default useChatConfig;

import { useState, useTransition } from 'react';
import { Flex, Layout, Typography, message as mes } from 'antd';
import { Welcome } from '@ant-design/x';
import Message from './components/Message';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { messageItem } from './type'
import { getImgTask, getImgUrl } from './service';
import SendMessage from './components/AiMesPushButton';
import AiType from './components/AiType';
import { ChatContext } from "@/pages/chat/ctx";
import useChatConfig from './hooks';

import style from './index.module.less';
import { getAiMessage, getMessage } from './utils';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const url = import.meta.env.VITE_API_CHATURL

type messListType = {
    text: Array<messageItem>
    img: Array<messageItem>
}

type mltKey = keyof messListType

const abortController = new AbortController();

const ChatPage = () => {
    const [, startTransition] = useTransition();
    const [messList, setMesList] = useState<messListType>({
        text: [],
        img: []
    })
    const { fetchEventData } = useChatConfig();
    // 查看环境
    const [aiType, setAitype] = useState<mltKey>('text');
    const sendTxt = (message: string) => {
        // 这里可以添加发送消息的逻辑
        setMesList(prev => ({
            ...prev,
            text: [...prev.text, getMessage(message)]
        }))
        const aiMessage = getAiMessage('');
        fetchEventData(
            `${url}/ai/aiChat?message=` + message,
            (data) => {
                const value = JSON.parse(data)?.content
                aiMessage.content += value;
                startTransition(() => {
                    setMesList(prevList => {
                        return {
                            ...prevList,
                            text: prevList.text.find(item =>
                                item.id === aiMessage.id) ?
                                prevList.text.map(item => item.id === aiMessage.id ? aiMessage : item) : [...prevList.text, aiMessage]
                        }
                    })
                })
            },
            (error) => {
                console.error(`fetchEventData: ${error}`)
            }
        )
    }

    const sendImg = async (message: string) => {
        // 这里可以添加发送消息的逻辑
        setMesList({
            ...messList,
            img: [...messList.img, {
                id: messList.img.length + 1,
                content: message,
                isUser: true,
            }]

        })
        // 请求
        const taskRes = await getImgTask(message)
        if (taskRes) {
            // 轮询请求接口
            const time = setInterval(async () => {
                const imgRes = await getImgUrl(taskRes.data.output.task_id)
                if (imgRes.data.usage?.image_count === 1) {
                    setMesList((prev) => {
                        return {
                            ...prev,
                            img: [...prev.img, {
                                id: prev.img.length + 1,
                                content: imgRes.data.output.results[0].url,
                                isUser: false,
                            }]
                        }
                    })
                    clearInterval(time)
                }
            }, 2000)
        } else {
            mes.warning(taskRes)
        }

    }

    const sendAiFun = {
        sendTxt,
        sendImg
    }

    async function aiPush(message: string) {
        if (!aiType) return;
        const ket = aiType === 'text' ? 'sendTxt' : 'sendImg';
        await sendAiFun[ket]?.(message)
    }

    return (
        <ChatContext.Provider value={{
            isSend: false
        }}>
            <Layout className='min-h-[calc(100vh-60px)] mt-4 bg-[#f5f5f5]'>
                <Sider width={200} theme="light">
                    <div className='p-[16px] text-center'>
                        <Title level={4} className='m-0'>aiChat</Title>
                    </div>
                    <AiType callBack={setAitype}></AiType>
                </Sider>
                <Layout>
                    <Header className='p-0 bg-[#fff]' >
                        <div style={{ padding: '0 16px', height: '100%' }}>
                            <Title level={4} style={{ margin: 0, lineHeight: '64px' }}>{aiType}</Title>
                        </div>
                    </Header>
                    <Content className='m-16 bg-[#f9f9f9]'>
                        {/* 欢迎区域 */}
                        <Welcome
                            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                            title="Welcome to aiChat"
                            description="Chat with aiChat, get help with your questions."
                        />
                        <div className={style.messageItem}>
                            <Flex gap="middle" vertical>
                                {(messList[aiType] ?? []).map(
                                    e => {
                                        return (
                                            <Message
                                                key={e.id}
                                                {...{ ...e, type: e.isUser ? 'user' : 'assistant', contentType: aiType }}
                                            />
                                        )
                                    })
                                }
                            </Flex>
                        </div>
                        <SendMessage
                            sendMes={
                                async (e) => {
                                    await aiPush(e)
                                    return true;
                                }}
                        >
                        </SendMessage>
                    </Content>
                </Layout>
            </Layout>
        </ChatContext.Provider>
    );
};

export default ChatPage;

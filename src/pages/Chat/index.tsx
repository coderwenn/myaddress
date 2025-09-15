import {useState, useTransition} from 'react';
import {Flex, Layout, Typography, message as mes} from 'antd';
import Message from './components/Message';
import {fetchEventSource} from '@microsoft/fetch-event-source';
import {messageType} from './type'
import {getImgTask, getImgUrl} from './service';
import SendMessage from './components/AiMesPushButton';
import AiType from './components/AiType';
import {ChatContext} from "@/pages/Chat/ctx.ts";

import style from './index.module.less';

const {Header, Sider, Content} = Layout;
const {Title} = Typography;

const ChatPage = () => {

    const [, startTransition] = useTransition();
    const [messList, setMesList] = useState<{
        text: messageType[],
        img: messageType[]
    }>({
        text: [],
        img: []
    })

    const [aiType, setAitype] = useState<'text' | 'img'>('text');

    const sendTxt = (message: string) => {
        // 这里可以添加发送消息的逻辑
        setMesList(prev => ({
            ...prev,
            text: [...prev.text, {
                id: Date.now() + Math.random(),
                content: message,
                isUser: true,
            }]
        }))
        fetchEventSource('http://localhost:3030/aiChat?message=' + message, {
            method: 'GET',
            headers: {
                Accept: "text/event-stream",
            },
            onmessage(event) {
                const value = JSON.parse(event?.data)?.content
                startTransition(() => {
                    setMesList(prevList => {
                        // 查看最后一条消息是否是用户发送的
                        const isUserLast = prevList.text.length > 0 && prevList.text[prevList.text.length - 1].isUser;
                        if (isUserLast) {
                            // 添加 AI 的第一条回复
                            return {
                                img: prevList.img,
                                text: [
                                    ...prevList.text,
                                    {
                                        id: Date.now() + Math.random(), // 避免 ID 冲突
                                        content: value,
                                        isUser: false,  // AI 消息
                                    }
                                ]
                            };
                        } else {
                            // 更新最后一条 AI 消息
                            const newMessages = [...prevList.text];
                            newMessages[newMessages.length - 1] = {
                                ...newMessages[newMessages.length - 1],
                                content: newMessages[newMessages.length - 1].content + value
                            };
                            return {
                                img: prevList.img,
                                text: newMessages
                            };
                        }
                    });
                })
            },
            onclose() {
            }
        })
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
            let time = setInterval(async () => {
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
            <Layout style={{minHeight: 'calc(100vh - 60px)', marginTop: 4, background: '#f5f5f5'}}>
                <Sider width={200} theme="light">
                    <div style={{padding: '16px', textAlign: 'center'}}>
                        <Title level={4} style={{margin: 0}}>AIChat</Title>
                    </div>
                    <AiType callBack={setAitype}></AiType>
                </Sider>
                <Layout>
                    <Header style={{padding: 0, background: '#fff'}}>
                        <div style={{padding: '0 16px', height: '100%'}}>
                            <Title level={4} style={{margin: 0, lineHeight: '64px'}}>{aiType}</Title>
                        </div>
                    </Header>
                    <Content style={{margin: '16px', backgroundColor: '#f9f9f9'}}>
                        <div className={style.messageItem}>
                            <Flex gap="middle" vertical>
                                {(messList[aiType] ?? []).map(
                                    e => {
                                        return (
                                            <Message
                                                key={e.id}
                                                {...{...e, type: e.isUser ? 'user' : 'assistant', contentType: aiType}}
                                            />
                                        )
                                    })
                                }
                            </Flex>
                        </div>
                        <SendMessage sendMes={
                            async (e) => {
                                await aiPush(e)
                                return true;
                            }}></SendMessage>
                    </Content>
                </Layout>
            </Layout>
        </ChatContext.Provider>
    );
};

export default ChatPage;
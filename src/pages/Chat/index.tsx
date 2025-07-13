import { useState } from 'react';
import { Layout, Menu, Input, Button, Typography, message as mes } from 'antd';
import {
  MessageOutlined,
  PlusOutlined,
  SendOutlined,
} from '@ant-design/icons';
import Message from './components/Message';
import { fetchEventSource } from '@microsoft/fetch-event-source';
// import { mockMessages } from './mockData'
import { messageType } from './type'
import { getImgTask, getImgUrl } from './service';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const ChatPage = () => {
  const [messageType, setMessageType] = useState<'text' | 'img'>('text');
  const [message, setMessage] = useState('一间有着精致窗户的花店，漂亮的木质门，摆放着花朵');
  const [messList, setMesList] = useState<messageType[]>([])

  // api类型
  const conversationTabs = [
    { key: 'text', label: '聊天' },
    { key: 'img', label: '图片生成' },
  ];

  const handleTabChange = (key: 'text' | 'img') => {
    setMessageType(key);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendTxt = () => {
    // 这里可以添加发送消息的逻辑
    setMessage('');
    setMesList([...messList, {
      id: messList.length + 1,
      content: message,
      isUser: true,
    }])

    fetchEventSource('http://localhost:3030/aiChat?message=' + message, {
      method: 'GET',
      headers: {
        Accept: "text/event-stream",
      },
      onmessage(event) {
        setMesList(prevList => {
          const last = prevList[prevList.length - 1];
          if (last.isUser) {
            // 添加 AI 的第一条回复
            return [
              ...prevList,
              {
                id: Date.now() + Math.random(), // 避免 ID 冲突
                content: event.data,
                isUser: false,
              }
            ];
          } else {
            // 更新最后一条 AI 消息
            const newMessages = [...prevList];
            newMessages[newMessages.length - 1] = {
              ...newMessages[newMessages.length - 1],
              content: newMessages[newMessages.length - 1].content + event.data
            };
            return newMessages;
          }
        });
      },
    })
  }

  const sendImg = async () => {
    // 这里可以添加发送消息的逻辑
    setMessage('');
    setMesList([...messList, {
      id: messList.length + 1,
      content: message,
      isUser: true,
    }])
    // 请求
    const taskRes = await getImgTask(message)

    if (taskRes) {
      // 轮询请求接口
      let time = setInterval(async () => {
        const imgRes = await getImgUrl(taskRes.data.output.task_id)
        if (imgRes.data.usage.image_count === 1) {
          setMesList((prev) => {
            return [...prev, {
              id: prev.length + 1,
              content: imgRes.data.output.results[0].url,
              isUser: false,
            }]
          })
          clearInterval(time)
        }
      }, 2000)
    } else {
      mes.warning(taskRes)
    }

  }

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    if (messageType === 'text') {
      sendTxt()
    } else if (messageType === 'img') {
      sendImg()
    }
  };

  return (
    <Layout style={{ minHeight: 'calc(100vh - 60px)', marginTop: 4, background: '#f5f5f5' }}>
      <Sider width={200} theme="light">
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            AIChat
          </Title>
        </div>
        <Menu
          selectedKeys={[messageType]}
          onSelect={({ key }) => handleTabChange(key as 'text' | 'img')}
          mode="inline"
        >
          {conversationTabs.map((tab) => (
            <Menu.Item
              key={tab.key}
              icon={<MessageOutlined />}
            >
              {tab.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ padding: '0 16px', height: '100%' }}>
            <Title level={4} style={{ margin: 0, lineHeight: '64px' }}>
              {messageType}
            </Title>
          </div>
        </Header>
        <Content style={{ margin: '16px', backgroundColor: '#f9f9f9' }}>
          <div
            style={{
              background: '#f5f5f5',
              padding: 24,
              minHeight: 700,
              borderRadius: 4,
            }}
          >
            {
              messList.map(
                e =>
                  <Message
                    type={e.isUser ? 'user' : 'assistant'}
                    key={e.id}
                    content={e.content}
                    contentType={messageType}
                  />
              )
            }
          </div>
          <div style={{ marginTop: 16 }}>
            <Input
              placeholder="有什么可以帮您的？"
              value={message}
              onChange={handleMessageChange}
              onPressEnter={handleSendMessage}
              suffix={
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                >
                  发送
                </Button>
              }
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChatPage;
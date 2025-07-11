import { useState } from 'react';
import { Layout, Menu, Input, Button, Typography } from 'antd';
import {
  MessageOutlined,
  PlusOutlined,
  SendOutlined,
} from '@ant-design/icons';
import Message from './components/Message';
import { fetchEventSource } from '@microsoft/fetch-event-source';
// import { mockMessages } from './mockData'
import { messageType } from './type'

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const ChatPage = () => {
  const [currentTab, setCurrentTab] = useState('关于人工智能的讨论');
  const [message, setMessage] = useState('');
  const [messList, setMesList] = useState<messageType[]>([])

  // 模拟历史对话数据
  const conversationTabs = [
    { key: '关于人工智能的讨论', label: '关于人工智能的讨论' },
    { key: '如何提高工作效率', label: '如何提高工作效率' },
    { key: '学习新技能的方法', label: '学习新技能的方法' },
    { key: '旅行计划建议', label: '旅行计划建议' },
    { key: '健康饮食习惯', label: '健康饮食习惯' },
  ];

  const handleTabChange = (key: string) => {
    setCurrentTab(key);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
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
  };

  return (
    <Layout style={{ minHeight: 'calc(100vh - 60px)', marginTop: 4, background: '#f5f5f5' }}>
      <Sider width={200} theme="light">
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            AIChat
          </Title>
        </div>
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          style={{ width: '100%', marginBottom: 16 }}
        >
          新建对话
        </Button>
        <Menu
          selectedKeys={[currentTab]}
          onSelect={({ key }) => handleTabChange(key)}
          mode="inline"
        >
          {conversationTabs.map((tab) => (
            <Menu.Item key={tab.key} icon={<MessageOutlined />}>
              {tab.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ padding: '0 16px', height: '100%' }}>
            <Title level={4} style={{ margin: 0, lineHeight: '64px' }}>
              {currentTab}
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
              messList.map(e => <Message type={e.isUser ? 'user' : 'assistant'} key={e.id} content={e.content} contentType="text" />)
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
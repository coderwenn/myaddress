import { useState } from 'react';
import { Layout, Menu, Avatar, Input, Button, List, Typography, Space } from 'antd';
import {
  MessageOutlined,
  PlusOutlined,
  UserOutlined,
  SendOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const ChatPage = () => {
  const [currentTab, setCurrentTab] = useState('关于人工智能的讨论');
  const [message, setMessage] = useState('');

  // 模拟历史对话数据
  const conversationTabs = [
    { key: '关于人工智能的讨论', label: '关于人工智能的讨论' },
    { key: '如何提高工作效率', label: '如何提高工作效率' },
    { key: '学习新技能的方法', label: '学习新技能的方法' },
    { key: '旅行计划建议', label: '旅行计划建议' },
    { key: '健康饮食习惯', label: '健康饮食习惯' },
  ];

  // 模拟聊天消息数据
  const messages = [
    {
      id: 1,
      content:
        '您好！很高兴为您介绍人工智能的基础知识。人工智能(AI)是计算机科学的一个分支，致力于创建能够模拟人类智能行为的系统。它包括机器学习、深度学习、自然语言处理、计算机视觉等多个领域。人工智能的核心是让机器能够学习、推理和自我改进。目前，AI已经在医疗诊断、自动驾驶、语音助手、推荐系统等多个领域有了广泛应用。您有什么具体想了解的方面吗？',
      isUser: false,
    },
    {
      id: 2,
      content: '机器学习和深度学习有什么区别？',
      isUser: true,
    },
    {
      id: 3,
      content:
        '机器学习和深度学习的区别主要在于：1. 机器学习是人工智能的一个子集，它使用统计方法让计算机系统能够“学习”（例如，通过数据分析逐步提高性能）而无需明确编程。机器学习算法包括决策树、支持向量机、随机森林等。2. 深度学习是机器学习的一个子集，它使用多层神经网络来模拟人脑的工作方式。深度学习模型能够自动发现数据中的模式，并且在处理大量非结构化数据（如图像、声音和文本）时表现尤为出色。3. 数据需求：深度学习通常需要更大量的数据和更强的计算能力，而传统机器学习算法可以在较小的数据集上有效工作。4. 特征提取：传统机器学习需要手动特征工程，而深度学习可以自动进行特征提取。5. 应用领域：深度学习在图像识别、语音识别、自然语言处理等领域表现突出，而传统机器学习在结构化数据分析方面仍有其优势。',
      isUser: false,
    },
  ];

  const handleTabChange = (key: string) => {
    setCurrentTab(key);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    // 这里可以添加发送消息的逻辑
    setMessage('');
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
              background: '#fff',
              padding: 24,
              minHeight: 700,
              borderRadius: 4,
            }}
          >
            <List
              itemLayout="bubble"
              dataSource={messages}
              renderItem={(msg) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar icon={msg.isUser ? <UserOutlined /> : <MessageOutlined />} />
                    }
                    content={
                      <Space direction="vertical">
                        <Text>{msg.content}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
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
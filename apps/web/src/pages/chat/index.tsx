import { useMemo, useState } from 'react';
import { Button, Flex, Layout, Typography, message as mes, Modal, Form, Input } from 'antd';
import { Welcome } from '@ant-design/x';
import Message from './components/Message';
import { messageItem } from './type'
import SendMessage from './components/AiMesPushButton';
import AiType from './components/AiType';
import { ChatContext } from "@/pages/chat/ctx";
import useChatConfig from './hooks';

import DialogueHistory from './components/dialogue-hstory';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
type messListType = {
	text: Array<messageItem>
	img: Array<messageItem>
}

type mltKey = keyof messListType

const ChatPage = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const {
		addNewConversation,
		conversationList,
		activeConversationId,
		setActiveConversationId,
		messagesByConversation,
		sendTextMessage,
		sendImageMessage,
		isSending,
		stopSending,
		retryLast,
		hasLastPrompt,
	} = useChatConfig();
	// 查看环境
	const [aiType, setAitype] = useState<mltKey>('text');

	async function aiPush(message: string) {
		if (!aiType) return;
		if (aiType === 'text') {
			await sendTextMessage(message, activeConversationId);
		} else {
			await sendImageMessage(message, activeConversationId);
		}
	}

	// 切换对话
	const handleTabChange = (id: number) => {
		setActiveConversationId(id);
	}
	// 新增对话
	const addConversation = () => {
		form.resetFields();
		setIsModalVisible(true);
	}

	// 处理表单提交
	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			await addNewConversation(values.title);
			setIsModalVisible(false);
			mes.success('对话创建成功');
		} catch (error) {
			console.error('表单验证失败:', error);
		}
	}

	// 处理Modal取消
	const handleCancel = () => {
		setIsModalVisible(false);
	}

	const currentMessages: messListType = useMemo(() => {
		if (!activeConversationId) return { text: [], img: [] };
		return messagesByConversation[String(activeConversationId)] ?? { text: [], img: [] };
	}, [activeConversationId, messagesByConversation])

	const isLoading = isSending(activeConversationId, aiType);
	const messageList = currentMessages[aiType] ?? [];
	const canRetry = hasLastPrompt(activeConversationId, aiType);

	return (
		<ChatContext.Provider value={{
			isSend: isLoading
		}}>
			<Layout className='min-h-[calc(100vh-60px)] mt-1 bg-[#f5f5f5]'>
				<Sider width={200} theme="light">
					<div className='p-[16px] text-center'>
						<Title level={4} className='m-0'>wennChat</Title>
					</div>
					{/* 新增对话 */}
					<div className='p-[16px] flex justify-center'>
						<Button type='primary' onClick={() => addConversation()}>新增对话</Button>
					</div>
					<div className='p-[16px]'>
						{/* <MessageList callBack={handleTabChange} /> */}
						<DialogueHistory
							conversationList={conversationList}
							activeId={activeConversationId}
							callBack={(id) => {
								handleTabChange(id)
							}} />
					</div>
				</Sider>
				<Layout>
					<Header className='p-0 bg-[#fff]' >
						<AiType callBack={setAitype}></AiType>
						{/* <div style={{ padding: '0 16px', height: '100%' }}>
							<Title level={4} className='m-0 lh-[64px]'>{aiType}</Title>
						</div> */}
					</Header>
					<Content className='m-1 bg-[#f9f9f9]'>
						{/* 欢迎区域 */}
						{messageList.length === 0 ? (
							<Welcome
								icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
								title="Welcome to wennChat"
								description="Chat with wennChat, get help with your questions."
							/>
						) : null}
						<div className='h-[calc(100vh-280px)] overflow-y-auto p-[24px] position-relative' >
							<Flex gap="middle" vertical>
								{messageList.map(
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
							loading={isLoading}
							sendMes={
								async (e) => {
									await aiPush(e)
									return true;
								}}
						>
						</SendMessage>
						<Flex justify="end" gap="small" className="mt-2">
							<Button disabled={!isLoading} onClick={() => stopSending(activeConversationId, aiType)}>
								Stop
							</Button>
							<Button disabled={isLoading || !canRetry} onClick={() => retryLast(activeConversationId, aiType)}>
								Retry
							</Button>
						</Flex>
					</Content>
				</Layout>
			</Layout>
			
			{/* 新增对话弹窗 */}
			<Modal
				title="新增对话"
				open={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				okText="确定"
				cancelText="取消"
			>
				<Form
					form={form}
					layout="vertical"
					name="add_conversation_form"
				>
					<Form.Item
						name="title"
						label="对话名称"
						rules={[
							{ required: true, message: '请输入对话名称' },
							{ max: 50, message: '对话名称不能超过50个字符' }
						]}
					>
						<Input placeholder="请输入对话名称" />
					</Form.Item>
				</Form>
			</Modal>
		</ChatContext.Provider>
	);
};

export default ChatPage;

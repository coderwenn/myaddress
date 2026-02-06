import { useState, useTransition } from 'react';
import { Button, Flex, Layout, Typography, message as mes, Modal, Form, Input } from 'antd';
import { Welcome } from '@ant-design/x';
import Message from './components/Message';
import { messageItem } from './type'
import { getImgTask, getImgUrl } from './service';
import SendMessage from './components/AiMesPushButton';
import AiType from './components/AiType';
import { ChatContext } from "@/pages/chat/ctx";
import useChatConfig from './hooks';

import { getAiMessage, getMessage } from './utils';
import DialogueHistory from './components/dialogue-hstory';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const url = import.meta.env.VITE_API_CHATURL

type messListType = {
	text: Array<messageItem>
	img: Array<messageItem>
}

type mltKey = keyof messListType

const ChatPage = () => {
	const [, startTransition] = useTransition();
	const [messList, setMesList] = useState<messListType>({
		text: [],
		img: []
	})
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const { fetchEventData,
		addNewConversation,
		conversationList,
	} = useChatConfig();
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

	// 切换对话
	const handleTabChange = (key: string) => {
		console.log(key, '1231231')
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

	return (
		<ChatContext.Provider value={{
			isSend: false
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
						<Welcome
							icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
							title="Welcome to wennChat"
							description="Chat with wennChat, get help with your questions."
						/>
						<div className='h-[calc(100vh-280px)] overflow-y-auto p-[24px] position-relative' >
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

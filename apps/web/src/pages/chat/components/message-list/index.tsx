import React, { useEffect } from "react";
import { Menu } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { getConversationList } from "@/pages/chat/service";

interface MessageListProps {
  callBack: (key: string) => void
}

const conversationTabs = [
  { key: 'text', label: '聊天' },
  { key: 'img', label: '图片生成' },
];

const MessageList: React.FC<MessageListProps> = ({
  callBack,
}) => {
  async function getList() {
    const res = await getConversationList();
    if (res.code === '200') {
    }
  }
  useEffect(() => {
    getList()
  }, [])
  return (
    <Menu
      selectedKeys={['text']}
      onSelect={({ key }) => callBack(key as 'text' | 'img')}
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
  )
}

export default MessageList
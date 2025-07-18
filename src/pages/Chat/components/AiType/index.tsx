import React, { memo, useState } from 'react'
import { MessageOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

const conversationTabs = [
    { key: 'text', label: '聊天' },
    { key: 'img', label: '图片生成' },
];

interface AiTypeProps {
    callBack: (key: 'text' | 'img') => void;
}

const AiType: React.FC<AiTypeProps> = (props) => {
    const [messageType, setMessageType] = useState<'text' | 'img'>('text');
    function handleTabChange(key: 'text' | 'img') {
        setMessageType(key);
        props.callBack?.(key);
    }

    return (
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
    )
}

export default memo(AiType)
import { SendOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import React, { memo, useState } from 'react'

interface AiMesPushButtonProps {
    sendMes: (mes: string) => Promise<boolean>;
}

const AiMesPushButton: React.FC<AiMesPushButtonProps> = (props) => {

    const { sendMes } = props;

    const [message, setMessage] = useState('')

    const handleSendMessage = async () => {
        if (message.trim() === '') return;
        await sendMes?.(message);
        setMessage(''); // 清空输入框
    };

    return (
        <div style={{ position: 'fixed', bottom: 0, backgroundColor: '#fff', zIndex: 1000, width: '84%', padding: '10px 20px', boxShadow: '0 -2px 4px rgba(0,0,0,0.1)' }}>
            <Input
                placeholder="有什么可以帮您的？"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
    )
}

export default memo(AiMesPushButton)
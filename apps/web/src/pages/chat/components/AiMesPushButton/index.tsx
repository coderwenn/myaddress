import React, { memo, useCallback, useState } from 'react'
import { Sender } from '@ant-design/x';
import { message } from "antd";

interface AiMesPushButtonProps {
    sendMes: (mes: string) => Promise<boolean>;
    loading?: boolean;
}

const SendMessage: React.FC<AiMesPushButtonProps> = (props) => {
    const [value, setValue] = useState<string>('');

    const { sendMes, loading = false } = props;

    const handleSendMessage = useCallback(
        async () => {
            if (loading || value.trim() === '') return;
            await sendMes?.(value);
            setValue(''); // 清空输入框
        }, [value, sendMes, loading]
    )

    return (
        <div
            className='w-full'
        >
            <Sender
                loading={loading}
                value={value}
                onChange={(v) => {
                    setValue(v);
                }}
                onSubmit={() => {
                    handleSendMessage()
                }}
                onCancel={() => {
                    message.error('Cancel sending!');
                }}
                autoSize={{ minRows: 2, maxRows: 6 }}
            />
        </div>
    )
}

export default memo(SendMessage)

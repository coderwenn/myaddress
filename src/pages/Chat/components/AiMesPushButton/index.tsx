import React, {memo, useCallback, useState} from 'react'
import {Sender} from '@ant-design/x';
import {message} from "antd";

import styles from './index.module.less'

interface AiMesPushButtonProps {
    sendMes: (mes: string) => Promise<boolean>;
}

const SendMessage: React.FC<AiMesPushButtonProps> = (props) => {
    const [value, setValue] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const {sendMes} = props;

    const handleSendMessage = useCallback(
        async () => {
            if (value.trim() === '') return;
            await sendMes?.(value);
            setValue(''); // 清空输入框
        }, [value, sendMes]
    )

    return (
        <div className={styles['aiInput']}>
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
                    setLoading(false);
                    message.error('Cancel sending!');
                }}
                autoSize={{minRows: 2, maxRows: 6}}
            />
        </div>
    )
}

export default memo(SendMessage)
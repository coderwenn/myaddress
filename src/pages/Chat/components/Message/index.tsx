import React from "react";

// 消息类型
interface IProps {
    type: 'user' | 'assistant';
    content: string;
    contentType: 'text' | 'img';
}

const Message: React.FC<IProps> = (props) => {
    const { type, content, contentType } = props;

    return <>
        {type === 'user' ? (
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '5px 0' }}>
                <div style={{ background: '#ebf2fe', padding: '10px', borderRadius: '10px' }}>
                    {/* 个人文本内容 */}
                    {content}
                </div>
            </div>
        ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '5px 0' }}>
                <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px' }}>
                    {contentType === 'text' ? content : <img width={700} src={content} alt="" />}
                </div>
            </div>
        )}
    </>
}

export default Message

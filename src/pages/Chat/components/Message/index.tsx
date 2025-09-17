import React, { useMemo } from "react";
import Text from "./components/Text";
import {MESSAGE_TYPE} from '../../type'

interface IProps {
    type: 'user' | 'assistant';
    content: string;
    contentType: 'text' | 'img';
    loading?: boolean;
}

const Message: React.FC<IProps> = (props) => {
    const { type, content, contentType } = props;

    const renderingTemplate = useMemo(() => {
        let dom = null
        switch (contentType) {
            case MESSAGE_TYPE.TEXT:
                dom = <Text content={content} />
                break;
            case MESSAGE_TYPE.IMGAGE:
                dom = <img width={700} src={content} alt="" />
                break;
            default:
                dom = <>不匹配类型</>
                break;
        }
        return dom

    }, [contentType, content])

    return <>
        {type === 'user' ? (
            // style={{ display: 'flex', justifyContent: 'flex-end', margin: '5px 0' }}
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '5px 0' }}>
                <div className="p-[10px]" style={{ background: '#ebf2fe', borderRadius: '10px' }}>
                    {content}
                </div>
            </div>
        ) : (
            //style={{ display: 'flex', justifyContent: 'flex-start', margin: '5px 0', maxWidth: '80%' }}
            <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '5px 0', maxWidth: '80%' }}>
                <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px' }}>
                    {renderingTemplate}
                </div>
            </div>
        )}
    </>
}

export default Message

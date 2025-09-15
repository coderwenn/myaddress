import React from "react";
import Text from "./components/Text";

interface IProps {
    type: 'user' | 'assistant';
    content: string;
    contentType: 'text' | 'img';
    loading?: boolean;
}

const Message: React.FC<IProps> = (props) => {
    const { type, content, contentType } = props;

    return <>
        {type === 'user' ? (
            // style={{ display: 'flex', justifyContent: 'flex-end', margin: '5px 0' }}
            <div className="flex justify-end" style={{maxWidth: '80%', margin: '5px 0'}} >
                <div className="p-[10px]" style={{ background: '#ebf2fe', borderRadius: '10px' }}>
                    {content}
                </div>
            </div>
        ) : (
            //style={{ display: 'flex', justifyContent: 'flex-start', margin: '5px 0', maxWidth: '80%' }}
            <div >
                <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px' }}>
                    {contentType === 'text' && <Text content={content} />}
                    {contentType === 'img' && <img width={700} src={content} alt="" />}
                </div>
            </div>
        )}
    </>
}

export default Message

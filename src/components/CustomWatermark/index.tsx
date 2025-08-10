import { Watermark } from 'antd'
import { memo, ReactNode } from 'react'


function CustomWatermark(props: { content: string, children: ReactNode }) {
    const { content, children } = props
    return (
        <Watermark content={content}>{children}</Watermark>
    )
}

export default memo(CustomWatermark)

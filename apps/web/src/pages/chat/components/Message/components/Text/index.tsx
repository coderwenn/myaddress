import { FC, memo } from "react";
import ReactMarkdown from 'react-markdown'
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import RehypeRaw from 'rehype-raw'

const TextComp: FC<{content: string}> = ({content}) => {
    return (
        <ReactMarkdown
            remarkPlugins={[
                RemarkGfm,
                RemarkBreaks,
                [RemarkMath, { singleDollarTextMath: true }] // 开启 $...$ 支持
            ]}
            rehypePlugins={[
                RehypeKatex,
                RehypeRaw
            ]}
        >
            {content}
        </ReactMarkdown>
    )
}

export default memo(TextComp)
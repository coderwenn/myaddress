import { FC } from "react";
import pdf from '@/file/温千禧-web前端开发工程师.pdf'

const Vitae: FC = () => {
    return (
        <div>
            <iframe
                src={pdf}
                width="100%"
                height="1000px"
            ></iframe>
        </div>
    )
}

export default Vitae;

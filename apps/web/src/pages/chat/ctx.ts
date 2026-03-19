import { createContext } from "react";

interface IChatCtx {
    isSend: boolean
}

export const ChatContext = createContext<IChatCtx>({
    isSend: false
})
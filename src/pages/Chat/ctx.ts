import {createContext} from "react";

interface IChatCtx {
    isSend: boolen
}

export const ChatContext = createContext<IChatCtx>({
    isSend: false
})
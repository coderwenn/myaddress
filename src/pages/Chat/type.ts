export type messageItem = {
    id: number,
    content: string,
    isUser: boolean,
}

export enum MESSAGE_TYPE {
    IMGAGE = 'img',
    TEXT = 'text'
}
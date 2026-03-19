export default class EventBus {
    private eventList: Record<string, Function[]> = {}

    constructor() { }

    /**
     * on 监听事件
     * @param evemtName 事件名
     * @param callback 回调函数
    */
    $on(evemtName: string, callback: Function) {
        if (!this.eventList?.[evemtName]) {
            this.eventList[evemtName] = []
        }
        this.eventList[evemtName].push(callback)
    }
    
    /**
     * emit 执行事件
     * @param evemtName 事件名
     * @param args 回调函数参数
    */
    $emit(eventName: string, ...args: any) {
        if (this.eventList?.[eventName]) {
            if(this.eventList[eventName].length){
                this.eventList[eventName].forEach((fn) => {
                    fn(...args)
                })
            } else console.log('事件不存在')
        } else {
            console.warn('事件不存在')
        }
    }

    $once(evemtName: string, callback: Function) {
        if (!this.eventList?.[evemtName]) {
            this.eventList[evemtName] = []
        }
        const onCeFunction = (...args: any[]) => {
            callback(...args)
            this.eventList[evemtName] = this.eventList[evemtName].filter((fn) => fn !== onCeFunction)

        }
        this.eventList[evemtName].push(onCeFunction)
    }

    $clear(name?: string) {
        if (name) {
            this.eventList[name] = []
        } else this.eventList = {}

    }
}
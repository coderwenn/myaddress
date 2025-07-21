import api from "./netWork"

export {
    api
}

function factorial(n: number): number {
    if (n === 1) return 1
    return n * factorial(n - 1)
}
'mousemove'
export function helper(str: string): number {
    const isr: Record<string, number> = {}
    for (const e of str) {
        isr[e] = isr[e] ? isr[e] + 1 : 1
    }
    if (Object.values(isr).some(v => v > 1)) {
        let sum = 1
        for (const e in isr) {
            sum *= factorial(isr[e])
        }
        return factorial(str.length) / sum
    } else return factorial(str.length)
}

// 解析url中的参数
export function parseUrlParams(url: string): Record<string, string> {
    const params: Record<string, string> = {};
    if(window?.URLSearchParams) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        urlParams.forEach((value, key) => {
            params[key] = value;
        });
    } else {
        const pairs = url.split('&');
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            params[key] = decodeURIComponent(value);
        }
    }
    return params;
}
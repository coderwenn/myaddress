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

function isPalindromeNumber(num: number | string) {
    // 将数字转换为字符串
    const str = num.toString();
    // 获取字符串的长度
    const len = str.length;
    // 对半比较字符
    for (let i = 0; i < len / 2; i++) {
        if (str[i] !== str[len - 1 - i]) {
            return false;
        }
    }
    return true;
}

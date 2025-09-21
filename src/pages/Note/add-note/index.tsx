import React, { useEffect, useRef } from "react";
import { Graph } from '@antv/x6';
import { data } from './data'

import styles from './index.module.less'

const AddNote: React.FC = () => {

    const X6Ref = useRef(null)

    function createX6() {
        if (X6Ref.current) {
            const graph = new Graph({
                // 挂载节点
                container: X6Ref.current,
                grid: true,
                width: 1000,
                height: 1000,
                background: {
                    color: '#fff', // 设置画布背景颜色
                },
            })
            // 平移和缩放
            graph.zoom(1)
            graph.translate(80, 40)
            // 事件
            graph.on('node:click', (e) => {
                console.log(e)
            })

            //塞入数据
            graph.fromJSON(data)
        }
    }

    useEffect(() => {
        createX6()
    }, [])

    return (
        <div className={styles.addNote}>
            <div ref={X6Ref} id="container"></div>
        </div>
    )
}

export default AddNote

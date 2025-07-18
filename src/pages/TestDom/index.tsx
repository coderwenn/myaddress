import React, { useEffect, useRef } from "react";
import { Graph } from '@antv/x6';

import styles from './index.module.less'

const data = {
    // 节点
    nodes: [
        {
            id: 'node1', // String，可选，节点的唯一标识
            x: 40,       // Number，必选，节点位置的 x 值
            y: 40,       // Number，必选，节点位置的 y 值
            width: 80,   // Number，可选，节点大小的 width 值
            height: 40,  // Number，可选，节点大小的 height 值
            label: 'hello', // String，节点标签
            // 渲染标识
            shape: 'rect', // 使用 rect 渲染
        },
        {
            id: 'node2', // String，节点的唯一标识
            x: 160,      // Number，必选，节点位置的 x 值
            y: 180,      // Number，必选，节点位置的 y 值
            width: 80,   // Number，可选，节点大小的 width 值
            height: 40,  // Number，可选，节点大小的 height 值
            label: 'world', // String，节点标签
            shape: 'ellipse', // 使用 ellipse 渲染
        },
    ],
    // 边
    edges: [
        {
            source: 'node1', // String，必须，起始节点 id
            target: 'node2', // String，必须，目标节点 id
            attrs: {
                line: {
                    stroke: 'orange',
                },
            },
        },
    ],
};


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

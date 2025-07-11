import { FolderOutlined, ClockCircleOutlined, StarOutlined, SettingOutlined } from "@ant-design/icons";
import img1 from '@/file/images/图片.jpg'

export const NoteHomeTags = [
    {
        key: '1',
        icon: <FolderOutlined />,
        label: '全部笔记',
    },
    {
        key: '2',
        icon: <ClockCircleOutlined />,
        label: '最近编辑',
    },
    {
        key: '3',
        icon: <StarOutlined />,
        label: '收藏笔记',
    },
    {
        key: '4',
        icon: <SettingOutlined />,
        label: '标签管理',
    },
]

export const notes = [
    {
        title: "项目周报 - 第四周",
        description: "本周主要完成了以下几个任务：1. 用户界面优化 2. 数据库性能优化 3. 新增API接口文档",
        tags: ["工作", "周报"],
        coverImage: img1
    },
    {
        title: "学习笔记 - React Hooks",
        description: "React Hooks 是 React 16.8 引入的新特性，允许在不编写类组件的情况下使用状态和其他 React 特性",
        tags: ["技术", "React"],
        coverImage: img1
    },
    {
        title: "旅行计划 - 春季",
        description: "春季旅行计划：1. 3月去云南赏花 2. 4月去西藏看桃花 3. 5月去青海看油菜花",
        tags: ["旅行", "计划"],
        coverImage: img1
    },
    {
        title: "读书笔记 -《思考，快与慢》",
        description: "这本书主要讲了人类的两种思维模式：快速直觉型思维和慢速逻辑型思维",
        tags: ["读书", "心理学"],
        coverImage: img1
    },
    {
        title: "美食探店 - 川菜",
        description: "川菜是中国八大菜系之一，以辣椒、花椒、豆瓣、泡菜等特点著称",
        tags: ["美食", "文化"],
        coverImage: img1
    },
    {
        title: "健身计划 - 2024",
        description: "新年健身计划：1. 每天跑步 2. 每周两次力量训练 3. 每月记录体重变化",
        tags: ["健身", "运动"],
        coverImage: img1
    },
];
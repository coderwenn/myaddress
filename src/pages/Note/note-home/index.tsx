import { FC, useState } from "react";
import { Input, Button, Menu, Dropdown, Space } from "antd";
import { PlusOutlined, SearchOutlined, UnorderedListOutlined, AppstoreOutlined, DownOutlined } from "@ant-design/icons";
import NoteCard from "@/pages/note/components/NoteCard";
import { NoteHomeTags, notes } from "./const";

import styles from "../index.module.less";
import { useNavigate } from "react-router-dom";


const NoteHome: FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div className={styles.notesContainer}>
            <div className={styles.sidebar}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    className={styles.sidebarMenu}
                    items={NoteHomeTags}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.viewControls}>
                        <Button.Group>
                            <Button
                                type={viewMode === 'grid' ? 'primary' : 'default'}
                                icon={<AppstoreOutlined />}
                                onClick={() => setViewMode('grid')}
                            />
                            <Button
                                type={viewMode === 'list' ? 'primary' : 'default'}
                                icon={<UnorderedListOutlined />}
                                onClick={() => setViewMode('list')}
                            />
                        </Button.Group>

                        <Dropdown
                            menu={{
                                items: [
                                    { key: '1', label: '最近更新' },
                                    { key: '2', label: '创建时间' },
                                    { key: '3', label: '标题' },
                                ],
                            }}
                        >
                            <Button>
                                <Space>
                                    最近更新
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    </div>

                    <div className={styles.searchBar}>
                        <Input.Search
                            placeholder="搜索笔记"
                            className={styles.searchInput}
                            prefix={<SearchOutlined />}
                        />
                    </div>

                    <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                        navigate('/note/addNote');
                    }}>
                        新建笔记
                    </Button>
                </div>

                <div className={viewMode === 'grid' ? styles.notesGrid : styles.notesList}>
                    {notes.map((note, index) => (
                        <NoteCard key={index} {...note} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NoteHome;

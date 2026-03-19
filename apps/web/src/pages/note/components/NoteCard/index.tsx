import { FC } from 'react';
import styles from '../../index.module.less';
import { Button, Dropdown, MenuProps } from 'antd';

interface NoteCardProps {
    title: string;
    description: string;
    tags: string[];
    coverImage: string;
}

const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                删除
            </a>
        ),
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                导出
            </a>
        ),
    }
];


const NoteCard: FC<NoteCardProps> = ({ title, description, tags, coverImage }) => {
    return (
        <div className={styles.noteCard}>
            <img src={coverImage} alt={title} className={styles.coverImage} />
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
                <div className={styles.footer}>
                    <div className={styles.tags}>
                        {tags.map((tag, index) => (
                            <span key={index} className={styles.tag}>{tag}</span>
                        ))}
                    </div>
                    <div className={styles.actions}>
                        <Button type="text" size="small" className={styles.actionButton}>收藏</Button>
                        <Dropdown menu={{ items }} placement="topRight" arrow>
                            <Button type="text" size="small" className={styles.actionButton}>更多</Button>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
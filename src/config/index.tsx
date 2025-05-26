import { IConfig } from '@/types';
import { GithubOutlined } from '@ant-design/icons';

// bar 菜单配置
export const barConfig: IConfig[] = [
  {
    label: '首页',
    key: 'home',
    path: '/home',
    type: 'push',
    isIcon: false,
  },
  {
    label: '关于我',
    key: 'curriculumVitae',
    type: 'push',
    isIcon: false,
    path: '/curriculumVitae'
  },
  {
    label: '博客',
    key: '/blog',
    type: 'open',
    isIcon: true,
    icon: <GithubOutlined />,
    path:'https://github.com/coderwenn'
  }
]
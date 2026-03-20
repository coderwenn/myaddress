import type { MenuDataItem } from '@ant-design/pro-components';
import { UserOutlined } from '@ant-design/icons';

export const menuRoutes: MenuDataItem[] = [
  {
    path: '/users',
    name: '用户管理',
    icon: <UserOutlined />,
  },
];

import { ProLayout } from '@ant-design/pro-components';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { menuRoutes } from '../routes';

export default function AdminLayout() {
  const location = useLocation();

  return (
    <ProLayout
      title="Admin Console"
      route={{ routes: menuRoutes }}
      location={{ pathname: location.pathname }}
      menuItemRender={(item, dom) =>
        item.path ? <Link to={item.path}>{dom}</Link> : dom
      }
      breadcrumbRender={(routes) => routes}
      contentStyle={{ padding: 24 }}
      fixedHeader
      fixSiderbar
    >
      <Outlet />
    </ProLayout>
  );
}

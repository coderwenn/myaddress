import { LoginFormPage, ProFormText } from '@ant-design/pro-components';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '@coderwenn/http';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (values: { account: string; password: string }) => {
    try {
      const res = await api.post('/auth/login', values);
      if (res?.access_token) {
        localStorage.setItem('admin_token', res.access_token);
        localStorage.setItem('admin_user', JSON.stringify(res.user ?? {}));
        message.success('登录成功');
        navigate('/users');
        return true;
      }
      message.error('登录失败');
      return false;
    } catch {
      message.error('登录失败');
      return false;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Card style={{ width: 420 }}>
        <LoginFormPage
          title="Admin Login"
          subTitle="后台管理系统"
          onFinish={handleLogin}
          submitter={{
            searchConfig: {
              submitText: '登录',
            },
          }}
        >
          <ProFormText
            name="account"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="账号"
            rules={[{ required: true, message: '请输入账号' }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          />
        </LoginFormPage>
      </Card>
    </div>
  );
}

// import React, { useState } from 'react';
// import type { FormProps } from 'antd';
// import { Button, Form, Input, Switch } from 'antd';
// import useUserInfo from '@/store';
// import { parseUrlParams } from '@/utils';
// import { useNavigate } from 'react-router-dom';
// import { addUser } from './api';

// import styles from './index.module.less'

// type FieldType = {
//     username: string;
//     password: string;
// };


// const Login: React.FC = () => {

//     const [isLogin, setIsLogin] = useState(false);

//     const upUserInfo = useUserInfo((state) => state.setUserInfo);
//     const params = parseUrlParams(window.location.href);
//     const navigate = useNavigate();

//     const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
//         console.log('Success:', values);
//         if (isLogin) {
//             upUserInfo(values);
//         } else {
//             console.log('注册');
//             const res = await addUser<{
//                 code: number
//             }>(values);
//             if (res.code === 200) {
//                 upUserInfo(values);
//             }
//         }
//         if (params.redirect) {
//             // 直接替换当前路由
//             window.location.href = params.redirect;
//         } else {
//             navigate('/home')
//         }
//     };

//     const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
//         console.log('Failed:', errorInfo);
//     };
//     return (
//         <div className={styles.loginBox}>
//             <Switch checkedChildren="登录" unCheckedChildren="注册" value={isLogin} onChange={setIsLogin} />
//             <Form
//                 name="basic"
//                 labelCol={{ span: 8 }}
//                 wrapperCol={{ span: 16 }}
//                 style={{ maxWidth: 600 }}
//                 initialValues={{ remember: true }}
//                 onFinish={onFinish}
//                 onFinishFailed={onFinishFailed}
//                 autoComplete="off"
//             >
//                 <Form.Item<FieldType>
//                     label="Username"
//                     name="username"
//                     validateTrigger={['onBlur']}
//                     rules={[
//                         {
//                             required: true,
//                             validator: (_rule, value: string) => {
//                                 if (!/^[a-zA-Z0-9_]+$/.test(value) || value.length < 6 || value.length > 16) {
//                                     return Promise.reject('请输入6位以上16位以下的英文字符的用户名')
//                                 }
//                                 return Promise.resolve()
//                             },
//                             message: '请输入6位以上16位以下的英文字符的用户名'
//                         }
//                     ]}
//                 >
//                     <Input />
//                 </Form.Item>

//                 <Form.Item<FieldType>
//                     label="Password"
//                     name="password"
//                     rules={[
//                         {
//                             required: true,
//                             validator: (_rule, value: string) => {
//                                 if (!/^[a-zA-Z0-9_]+$/.test(value) || value.length < 6 || value.length > 16) {
//                                     return Promise.reject('请输入6位以上16位以下的英文字符的密码')
//                                 }
//                                 return Promise.resolve()
//                             },
//                             message: '请输入6位以上16位以下的英文字符的密码'
//                         }
//                     ]}
//                 >
//                     <Input.Password />
//                 </Form.Item>

//                 <Form.Item label={null}>
//                     <Button type="primary" htmlType="submit">
//                         123123
//                     </Button>
//                 </Form.Item>
//             </Form>
//         </div>
//     )

// }

// export default Login;

import {
  LockOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, Tabs, message, theme } from 'antd';
import { useContext, useState } from 'react';
import { LayoutContext } from '@/App';


type LoginType = 'phone' | 'account';


const Page = () => {

  const { setValue, setFuns } = useContext(LayoutContext);

  const [form] = Form.useForm();
  const [loginType, setLoginType] = useState<LoginType>('account');
  const { token } = theme.useToken();
  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh',
        position: 'relative'
      }}
    >
      <LoginFormPage
        form={form}
        backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
        logo="https://github.githubassets.com/favicons/favicon.png"
        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        title="coder的网站"
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0,0.65)',
          backdropFilter: 'blur(4px)',
        }}
        subTitle="coder的网站"
        actions={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
          </div>
        }
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
          {/* 暂时不支持手机号登录 */}
          <Tabs.TabPane key={'phone'} disabled tab={'手机号登录'} />
        </Tabs>
        {loginType === 'account' && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                onFocus: () => {
                  setValue('username');
                  setFuns({
                    setFormValue: (obj: Record<string, string>) => {
                      form.setFieldsValue(obj);
                    },
                    getFormValue: () => {
                      return form.getFieldsValue();
                    }
                  })
                },
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}

              placeholder={'用户名: admin or user'}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'密码: ant.design'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </>
        )}
        {loginType === 'phone' && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: (
                  <MobileOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              name="mobile"
              placeholder={'手机号'}
              rules={[
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder={'请输入验证码'}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${'获取验证码'}`;
                }
                return '获取验证码';
              }}
              name="captcha"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
              onGetCaptcha={async () => {
                message.success('获取验证码成功！验证码为：1234');
              }}
            />
          </>
        )}
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
        </div>
      </LoginFormPage>
    </div>
  );
};

export default () => {
  return (
    <ProConfigProvider dark>
      <Page />
    </ProConfigProvider>
  );
};
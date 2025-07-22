import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, Switch } from 'antd';
import useUserInfo from '@/store';
import { parseUrlParams } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { addUser } from './api';

import styles from './index.module.less'

type FieldType = {
    username: string;
    password: string;
};


const Login: React.FC = () => {

    const [isLogin, setIsLogin] = useState(false);

    const upUserInfo = useUserInfo((state) => state.setUserInfo);
    const params = parseUrlParams(window.location.href);
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        if (isLogin) {
            upUserInfo(values);
        } else {
            console.log('注册');
            const res = await addUser<{
                code: number
            }>(values);
            if(res.code === 200){
                upUserInfo(values);
            }
        }
        if (params.redirect) {
            // 直接替换当前路由
            window.location.href = params.redirect;
        } else {
            navigate('/home')
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className={styles.loginBox}>
            <Switch checkedChildren="登陆" unCheckedChildren="注册" value={isLogin} onChange={setIsLogin} />
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Username"
                    name="username"
                    // 只能输入英文
                    validateTrigger={['onBlur']}
                    rules={[
                        {
                            required: true,
                            validator: (_rule, value: string) => {
                                if (!/^[a-zA-Z0-9_]+$/.test(value) || value.length < 6 || value.length > 16) {
                                    return Promise.reject('请输入6位以上16位以下的英文字符的用户名')
                                }
                                return Promise.resolve()
                            },
                            message: '请输入6位以上16位以下的英文字符的用户名'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            validator: (_rule, value: string) => {
                                if (!/^[a-zA-Z0-9_]+$/.test(value) || value.length < 6 || value.length > 16) {
                                    return Promise.reject('请输入6位以上16位以下的英文字符的密码')
                                }
                                return Promise.resolve()
                            },
                            message: '请输入6位以上16位以下的英文字符的密码'
                        }
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )

}

export default Login;

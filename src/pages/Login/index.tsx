import React from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import useUserInfo from '@/store';
import { parseUrlParams } from '@/utils';
import { useNavigate } from 'react-router-dom';

import styles from './index.module.less'

type FieldType = {
    username?: string;
    password?: string;
};


const Login: React.FC = () => {
    const upUserInfo = useUserInfo((state) => state.setUserInfo);
    const params = parseUrlParams(window.location.href);
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
        upUserInfo(values);
        if(params.redirect){
            // 直接替换当前路由
            window.location.href = params.redirect;
        } else {
            navigate('/home')
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return <div className={styles.loginBox}>
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
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
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

}

export default Login;

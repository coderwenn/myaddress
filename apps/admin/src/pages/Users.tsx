import { PageContainer, ProFormSelect, ProFormSwitch, ProFormText, ProTable, ModalForm } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';

type UserStatus = 'ACTIVE' | 'INACTIVE';

type User = {
  id: number;
  account: string;
  status: UserStatus;
  is_admin: boolean;
  has_backoffice: boolean;
  created_at?: string;
  updated_at?: string;
};

type FormState = {
  account: string;
  password?: string;
  status: UserStatus;
  is_admin: boolean;
  has_backoffice: boolean;
};

const API_BASE = '/api/users';

export default function UsersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const actionRef = useRef<{ reload?: () => void }>(null);

  const columns: ProColumns<User>[] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '账号', dataIndex: 'account' },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        ACTIVE: { text: '生效', status: 'Success' },
        INACTIVE: { text: '不生效', status: 'Default' },
      },
    },
    {
      title: '管理员',
      dataIndex: 'is_admin',
      render: (_, record) => (record.is_admin ? '是' : '否'),
    },
    {
      title: '后台权限',
      dataIndex: 'has_backoffice',
      render: (_, record) => (record.has_backoffice ? '是' : '否'),
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            setEditing(record);
            setModalOpen(true);
          }}
        >
          编辑
        </Button>,
        <Button
          key="delete"
          type="link"
          danger
          onClick={async () => {
            const res = await fetch(`${API_BASE}/${record.id}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              message.success('删除成功');
              actionRef.current?.reload?.();
            } else {
              message.error('删除失败');
            }
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer
      title="用户管理"
      extra={[
        <Button
          key="create"
          type="primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          新建用户
        </Button>,
      ]}
    >
      <ProTable<User>
        rowKey="id"
        columns={columns}
        search={false}
        actionRef={actionRef}
        request={async () => {
          const res = await fetch(API_BASE);
          const data = await res.json();
          return {
            data: data.data ?? [],
            success: res.ok,
          };
        }}
      />

      <ModalForm<FormState>
        title={editing ? '编辑用户' : '新建用户'}
        open={modalOpen}
        initialValues={
          editing
            ? {
                account: editing.account,
                status: editing.status,
                is_admin: editing.is_admin,
                has_backoffice: editing.has_backoffice,
              }
            : {
                status: 'ACTIVE',
                is_admin: false,
                has_backoffice: false,
              }
        }
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
          }
          setModalOpen(open);
        }}
        onFinish={async (values) => {
          const payload: FormState = {
            account: values.account,
            password: values.password,
            status: values.status,
            is_admin: values.is_admin ?? false,
            has_backoffice: values.has_backoffice ?? false,
          };
          const url = editing ? `${API_BASE}/${editing.id}` : API_BASE;
          const method = editing ? 'PUT' : 'POST';
          const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            message.success('保存成功');
            actionRef.current?.reload?.();
            return true;
          }
          message.error('保存失败');
          return false;
        }}
      >
        <ProFormText
          name="account"
          label="账号"
          rules={[{ required: true, message: '请输入账号' }]}
        />
        <ProFormText.Password
          name="password"
          label="密码"
          placeholder={editing ? '不修改可留空' : '请输入密码'}
          rules={editing ? [] : [{ required: true, message: '请输入密码' }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          valueEnum={{
            ACTIVE: '生效',
            INACTIVE: '不生效',
          }}
          rules={[{ required: true, message: '请选择状态' }]}
        />
        <ProFormSwitch name="is_admin" label="管理员" />
        <ProFormSwitch name="has_backoffice" label="后台权限" />
      </ModalForm>
    </PageContainer>
  );
}

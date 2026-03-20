import { PageContainer, ProFormSelect, ProFormSwitch, ProFormText, ProTable, ModalForm, ProFormTextArea } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import api from '@coderwenn/http';

type ApiProvider = 'QWEN' | 'DEEPSEEK';

type ApiKey = {
  id: number;
  user_id: number;
  provider: ApiProvider;
  api_key_preview: string;
  allowed_users?: number[];
  is_active: boolean;
  remark?: string;
};

type FormState = {
  user_id: number;
  provider: ApiProvider;
  api_key?: string;
  allowed_users?: string;
  is_active: boolean;
  remark?: string;
};

const API_BASE = '/api/api-keys';

function parseAllowedUsers(value?: string) {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((num) => !Number.isNaN(num));
}

export default function ApiKeysPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ApiKey | null>(null);
  const actionRef = useRef<{ reload?: () => void }>(null);

  const columns: ProColumns<ApiKey>[] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '用户ID', dataIndex: 'user_id' },
    {
      title: '服务商',
      dataIndex: 'provider',
      valueEnum: {
        QWEN: { text: '千问' },
        DEEPSEEK: { text: 'DeepSeek' },
      },
    },
    {
      title: 'API Key',
      dataIndex: 'api_key_preview',
      render: (_, record) => record.api_key_preview || '****',
    },
    {
      title: '可用人员',
      dataIndex: 'allowed_users',
      render: (_, record) => (record.allowed_users?.length ? record.allowed_users.join(', ') : '全部'),
    },
    {
      title: '启用',
      dataIndex: 'is_active',
      render: (_, record) => (record.is_active ? '是' : '否'),
    },
    { title: '备注', dataIndex: 'remark' },
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
            const res = await api.delete(`${API_BASE}/${record.id}`);
            if (res) {
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
      title="API Key 管理"
      extra={[
        <Button
          key="create"
          type="primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          新建 API Key
        </Button>,
      ]}
    >
      <ProTable<ApiKey>
        rowKey="id"
        columns={columns}
        search={false}
        actionRef={actionRef}
        request={async () => {
          const data = await api.get(API_BASE);
          return {
            data: data.data ?? [],
            success: true,
          };
        }}
      />

      <ModalForm<FormState>
        title={editing ? '编辑 API Key' : '新建 API Key'}
        open={modalOpen}
        initialValues={
          editing
            ? {
                user_id: editing.user_id,
                provider: editing.provider,
                is_active: editing.is_active,
                allowed_users: editing.allowed_users?.join(','),
                remark: editing.remark,
              }
            : {
                provider: 'QWEN',
                is_active: true,
              }
        }
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
          }
          setModalOpen(open);
        }}
        onFinish={async (values) => {
          const payload = {
            user_id: Number(values.user_id),
            provider: values.provider,
            api_key: values.api_key,
            allowed_users: parseAllowedUsers(values.allowed_users),
            is_active: values.is_active ?? true,
            remark: values.remark,
          };
          const url = editing ? `${API_BASE}/${editing.id}` : API_BASE;
          const method = editing ? 'PUT' : 'POST';
          const res = await api.request({
            url,
            method,
            data: payload,
          });
          if (res) {
            message.success('保存成功');
            actionRef.current?.reload?.();
            return true;
          }
          message.error('保存失败');
          return false;
        }}
      >
        <ProFormText
          name="user_id"
          label="用户ID"
          rules={[{ required: true, message: '请输入用户ID' }]}
        />
        <ProFormSelect
          name="provider"
          label="服务商"
          valueEnum={{
            QWEN: '千问',
            DEEPSEEK: 'DeepSeek',
          }}
          rules={[{ required: true, message: '请选择服务商' }]}
        />
        <ProFormText.Password
          name="api_key"
          label="API Key"
          placeholder={editing ? '不修改可留空' : '请输入 API Key'}
          rules={editing ? [] : [{ required: true, message: '请输入 API Key' }]}
        />
        <ProFormText
          name="allowed_users"
          label="可用人员"
          placeholder="多个用户ID用逗号分隔，空表示全部"
        />
        <ProFormSwitch name="is_active" label="启用" />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>
    </PageContainer>
  );
}

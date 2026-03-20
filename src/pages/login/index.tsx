import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './index.module.scss';
import { login } from '@/apis/auth';
import { useAuthStore } from '@/stores/authStore';

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const authLogin = useAuthStore((s) => s.login);

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: ({ token, user }) => {
      authLogin(token, [...user.roles], [...user.permissions]);
      queryClient.setQueryData(['user', 'me'], user);

      const from = searchParams.get('from') ?? '/';

      // 重定向到 from 页面 使用navigate会导致路由缓存,这样能保证拿到最新的数据
      window.location.href = from;
    },
  });

  const onFinish = (values: LoginFormValues) => {
    mutate(values);
  };

  return (
    <div className={styles.login}>
      <div className={styles.card}>
        <h1 className={styles.title}>登录</h1>
        <p className={styles.subtitle}>欢迎回来，请登录您的账户（演示：admin / 123456）</p>

        <Form form={form} layout="vertical" size="large" onFinish={onFinish} className={styles.form}>
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input
              prefix={<UserOutlined className={styles.inputIcon} />}
              placeholder="请输入用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item className={styles.submitItem}>
            <Button type="primary" htmlType="submit" block size="large" loading={isPending}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;

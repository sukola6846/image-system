import { useState } from 'react';
import { Button, Modal, Form, Input, Select, Table, Pagination, ConfigProvider } from 'antd';
import { useThemeSync } from './hooks/useThemeSync';
import { useAntdTheme } from './hooks/useAntdTheme';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import Home from './pages/home';
import styles from './app1.module.scss';

function App() {
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  useThemeSync();
  const antdTheme = useAntdTheme();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: 'Confirm Password',
      dataIndex: 'confirmPassword',
      key: 'confirmPassword',
    },
  ];

  return (
    <ConfigProvider theme={antdTheme}>
      <div className={`${styles.app} min-h-screen`}>
        <h1 className={styles.title}>App</h1>
        <p className="text-secondary">演示主题与背景切换</p>
        <Button onClick={() => setThemeModalOpen(true)} type="primary">
          主题设置
        </Button>
        <Button disabled type="primary">
          禁用状态
        </Button>
        <Modal title="主题与背景切换" open={themeModalOpen} onCancel={() => setThemeModalOpen(false)} footer={null}>
          <ThemeSwitcher />
        </Modal>
        <Home />
        <Form>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input />
          </Form.Item>
          <Form.Item label="Confirm Password" name="confirmPassword">
            <Input />
          </Form.Item>
          <Form.Item>
            <Select
              options={[
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '3', value: 3 },
              ]}
            ></Select>
          </Form.Item>
        </Form>
        <Table dataSource={[]} columns={columns} />
        <Pagination total={100} pageSize={10} current={1} />
      </div>
    </ConfigProvider>
  );
}

export default App;

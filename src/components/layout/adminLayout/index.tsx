import { useState, useEffect } from 'react';
import cn from 'classnames';
import { Layout, Menu, Button, Modal } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, BgColorsOutlined } from '@ant-design/icons';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { MENU_ITEMS } from './menuConfig';
import styles from './index.module.scss';

const SIDER_COLLAPSED_KEY = 'admin-sider-collapsed';

const AdminLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const stored = localStorage.getItem(SIDER_COLLAPSED_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(() => {
    const pathname = window.location.pathname || '/';
    return [pathname];
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIDER_COLLAPSED_KEY, JSON.stringify(collapsed));
    } catch {
      // ignore
    }
  }, [collapsed]);

  const handleMenuClick: React.ComponentProps<typeof Menu>['onClick'] = ({ key }) => {
    setSelectedKeys([key]);
    // 后续接入 React Router 时可使用 navigate(key)
  };

  return (
    <Layout className={styles.root}>
      <Layout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={220}
        collapsedWidth={64}
        className={styles.sider}
      >
        <div className={cn(styles.logoWrap, collapsed && styles.logoWrapCollapsed)}>
          {!collapsed && <span className={styles.logoText}>图片管理</span>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={['image']}
          items={MENU_ITEMS}
          onClick={handleMenuClick}
          className={styles.menu}
        />
      </Layout.Sider>

      <Layout className={styles.mainLayout}>
        <Layout.Header className={styles.header}>
          <div className={styles.headerLeft}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className={styles.headerBtn}
              aria-label={collapsed ? '展开菜单' : '收起菜单'}
            />
            <h2 className={styles.headerTitle}>管理员后台</h2>
          </div>
          <Button
            type="text"
            icon={<BgColorsOutlined />}
            onClick={() => setThemeModalOpen(true)}
            className={styles.headerBtn}
          >
            主题设置
          </Button>
        </Layout.Header>

        <Layout.Content className={styles.content}>{children}</Layout.Content>

        <Layout.Footer className={styles.footer}>图片管理系统 ©{new Date().getFullYear()} 版权所有</Layout.Footer>
      </Layout>

      <Modal title="主题与背景切换" open={themeModalOpen} onCancel={() => setThemeModalOpen(false)} footer={null}>
        <ThemeSwitcher />
      </Modal>
    </Layout>
  );
};

export default AdminLayout;

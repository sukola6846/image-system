import React from 'react';
import { Card, Descriptions } from 'antd';
import styles from './index.module.scss';

const Profile: React.FC = () => {
  return (
    <div className={styles.profile}>
      <h1 className={styles.title}>个人中心</h1>
      <p className={styles.subtitle}>查看与管理您的账户信息</p>

      <Card className={styles.card} title="基本信息" bordered={false}>
        <Descriptions column={1}>
          <Descriptions.Item label="用户名">管理员</Descriptions.Item>
          <Descriptions.Item label="邮箱">admin@example.com</Descriptions.Item>
          <Descriptions.Item label="角色">管理员</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className={styles.card} title="账户安全" bordered={false}>
        <div className={styles.section}>
          <p className={styles.sectionDesc}>修改密码、绑定手机等安全设置可在此扩展</p>
        </div>
      </Card>
    </div>
  );
};

export default Profile;

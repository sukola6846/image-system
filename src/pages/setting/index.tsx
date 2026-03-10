import React from 'react';
import { Card } from 'antd';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import styles from './index.module.scss';

const Setting: React.FC = () => {
  return (
    <div className={styles.setting}>
      <h1 className={styles.title}>设置</h1>
      <p className={styles.subtitle}>管理您的偏好设置</p>

      <Card className={styles.card} title="外观" variant="outlined">
        <ThemeSwitcher />
      </Card>

      <Card className={styles.card} title="通用" variant="outlined">
        <div className={styles.section}>
          <p className={styles.sectionDesc}>更多设置项可根据需求扩展</p>
        </div>
      </Card>
    </div>
  );
};

export default Setting;

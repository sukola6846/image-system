import React from 'react';
import { Empty } from 'antd';
import styles from './index.module.scss';

const ImageTrash: React.FC = () => {
  return (
    <div className={styles.trash}>
      <h1 className={styles.title}>回收站</h1>
      <p className={styles.subtitle}>已删除的图片可在此恢复</p>
      <Empty description="暂无已删除图片" className={styles.empty} />
    </div>
  );
};

export default ImageTrash;

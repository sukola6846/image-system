import React from 'react';
import { Empty } from 'antd';
import styles from './index.module.scss';

const ImageList: React.FC = () => {
  return (
    <div className={styles.imageList}>
      <h1 className={styles.title}>图片列表</h1>
      <p className={styles.subtitle}>管理与浏览您的图片素材</p>
      <Empty description="暂无图片" className={styles.empty} />
    </div>
  );
};

export default ImageList;

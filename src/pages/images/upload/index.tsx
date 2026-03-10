import React from 'react';
import { Empty } from 'antd';
import styles from './index.module.scss';

const ImageUpload: React.FC = () => {
  return (
    <div className={styles.upload}>
      <h1 className={styles.title}>上传图片</h1>
      <p className={styles.subtitle}>批量或单张上传图片</p>
      <Empty description="上传功能开发中" className={styles.empty} />
    </div>
  );
};

export default ImageUpload;

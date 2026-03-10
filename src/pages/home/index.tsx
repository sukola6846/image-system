import React from 'react';
import { CloudUploadOutlined, PictureOutlined, UnorderedListOutlined, BarChartOutlined } from '@ant-design/icons';
import cn from 'classnames';
import styles from './index.module.scss';

const stats = [
  { label: '总图片数', value: '12,847' },
  { label: '本月上传', value: '328' },
  { label: '存储占用', value: '2.4GB' },
];

const quickActions = [
  { icon: <CloudUploadOutlined />, title: '上传图片', desc: '批量或单张上传' },
  { icon: <PictureOutlined />, title: '图库浏览', desc: '查看与管理素材' },
  { icon: <UnorderedListOutlined />, title: '标签管理', desc: '分类与检索' },
  { icon: <BarChartOutlined />, title: '使用统计', desc: '流量与趋势' },
];

const recentActivity = [
  { action: '上传 15 张图片', time: '2 分钟前' },
  { action: '创建标签「产品图」', time: '1 小时前' },
  { action: '删除 3 张过期素材', time: '昨天' },
];

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      {/* Hero 区块 */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>IMAGE SYSTEM</span>
          <h1 className={styles.heroTitle}>
            掌控你的
            <br />
            <span className={styles.heroAccent}>视觉资产</span>
          </h1>
          <p className={styles.heroDesc}>上传、管理、分发 —— 一站式图片中枢</p>
        </div>
      </section>

      {/* 数据统计区块 */}
      <section className={styles.stats}>
        {stats.map((item) => (
          <div key={item.label} className={styles.statCard}>
            <span className={styles.statValue}>{item.value}</span>
            <span className={styles.statLabel}>{item.label}</span>
          </div>
        ))}
      </section>

      {/* 快捷操作区块 */}
      <section className={styles.actions}>
        <h2 className={styles.sectionTitle}>快捷入口</h2>
        <div className={styles.actionGrid}>
          {quickActions.map((item) => (
            <button key={item.title} type="button" className={styles.actionCard}>
              <span className={styles.actionIcon}>{item.icon}</span>
              <span className={styles.actionTitle}>{item.title}</span>
              <span className={styles.actionDesc}>{item.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 最近动态区块 */}
      <section className={styles.activity}>
        <h2 className={styles.sectionTitle}>最近动态</h2>
        <div className={styles.activityList}>
          {recentActivity.map((item, i) => (
            <div key={i} className={cn(styles.activityItem, i === 0 && styles.activityItemFirst)}>
              <span className={styles.activityAction}>{item.action}</span>
              <span className={styles.activityTime}>{item.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

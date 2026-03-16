import { useNavigationProgress } from '@/router/hooks/useNavigationProgress';
import classNames from 'classnames';
import styles from './index.module.scss';

/**
 * 全局顶部进度条，路由切换时显示
 * 始终挂载，用 opacity 控制显隐，避免引起页面跳动
 */
export function NavigationProgress() {
  const { progress, visible } = useNavigationProgress();

  return (
    <div
      className={classNames(styles.wrapper, { [styles.visible]: visible })}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-hidden={!visible}
    >
      <div className={styles.bar} style={{ width: `${progress}%` }} />
    </div>
  );
}

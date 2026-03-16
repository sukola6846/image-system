import { useEffect, useState } from 'react';
import { useNavigation } from 'react-router-dom';

/** 加载阶段：0 → 30 → 60 → 85，让进度变化更明显 */
const STAGES = [
  { progress: 30, delay: 80 },
  { progress: 60, delay: 200 },
  { progress: 85, delay: 350 },
];
const COMPLETE_DELAY_MS = 200;

/**
 * 监听路由导航状态，驱动顶部进度条
 * loading/submitting 时开始，idle 时完成
 */
export function useNavigationProgress() {
  const { state } = useNavigation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state === 'loading' || state === 'submitting') {
      const tid = setTimeout(() => {
        setVisible(true);
        setProgress(0);
      }, 0);
      const timers: ReturnType<typeof setTimeout>[] = [tid];
      for (const { progress: p, delay } of STAGES) {
        timers.push(setTimeout(() => setProgress(p), delay));
      }
      return () => timers.forEach((t) => clearTimeout(t));
    }

    if (state === 'idle' && visible) {
      const tick = setTimeout(() => setProgress(100), 0);
      const done = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, COMPLETE_DELAY_MS);
      return () => {
        clearTimeout(tick);
        clearTimeout(done);
      };
    }
  }, [state, visible]);

  return { progress, visible };
}

import { Space } from 'antd';
import { useThemeStore } from '@/stores';
import { THEME_COLORS, type ThemeColorId } from '@/constants/theme/themeColors';
import { BACKGROUND_STYLES, type BackgroundStyleId } from '@/constants/theme/backgroundStyles';
import styles from './index.module.scss';

export function ThemeSwitcher() {
  const { themeColorId, backgroundStyleId, setThemeColorId, setBackgroundStyleId } = useThemeStore();

  return (
    <Space vertical size="large" style={{ width: '100%' }}>
      <div>
        <div className={styles.label}>主题色</div>
        <div className={styles.colorGrid}>
          {THEME_COLORS.map(({ id, name, value }) => (
            <button
              key={id}
              type="button"
              className={styles.colorSwatch}
              style={{ backgroundColor: value }}
              title={name}
              aria-pressed={themeColorId === id}
              onClick={() => setThemeColorId(id as ThemeColorId)}
            >
              {themeColorId === id && <span className={styles.check}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className={styles.label}>背景风格</div>
        <div className={styles.bgGrid}>
          {BACKGROUND_STYLES.map(({ id, name, bg, textPrimary }) => (
            <button
              key={id}
              type="button"
              className={`${styles.bgOption} ${backgroundStyleId === id ? styles.active : ''}`}
              style={{ backgroundColor: bg, color: textPrimary }}
              onClick={() => setBackgroundStyleId(id as BackgroundStyleId)}
            >
              <span className={styles.bgLabel}>{name}</span>
            </button>
          ))}
        </div>
      </div>
    </Space>
  );
}

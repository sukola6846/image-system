import type { ThemeConfig } from 'antd';
import { theme as antdTheme } from 'antd';
import { useMemo } from 'react';
import { useThemeStore } from '../stores';
import { getThemeColorValue } from '@/constants/theme/themeColors';
import { getBackgroundStyle } from '@/constants/theme/backgroundStyles';

/**
 * 根据 themeStore 生成 Ant Design ConfigProvider 的 theme 配置
 * 使 Ant Design 组件随项目主题色和背景风格联动
 */
export function useAntdTheme(): ThemeConfig {
  const { themeColorId, backgroundStyleId } = useThemeStore();

  return useMemo(() => {
    const primaryColor = getThemeColorValue(themeColorId);
    const bgStyle = getBackgroundStyle(backgroundStyleId);

    const token: ThemeConfig['token'] = {
      colorPrimary: primaryColor,
      colorBgContainer: bgStyle.bg,
      colorBgLayout: bgStyle.bg,
      colorText: bgStyle.textPrimary,
      colorTextSecondary: bgStyle.textSecondary,
      colorTextDisabled: bgStyle.textDisabled,
      colorTextPlaceholder: bgStyle.textPlaceholder,
      colorBgElevated: bgStyle.bg,
    };

    return {
      algorithm: bgStyle.type === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token,
    };
  }, [themeColorId, backgroundStyleId]);
}

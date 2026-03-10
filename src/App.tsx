import { ConfigProvider } from 'antd';
import { useThemeSync } from './hooks/useThemeSync';
import { useAntdTheme } from './hooks/useAntdTheme';
import { Router } from './router';

function App() {
  useThemeSync();
  const antdTheme = useAntdTheme();

  return (
    <ConfigProvider theme={antdTheme}>
      <Router />
    </ConfigProvider>
  );
}

export default App;

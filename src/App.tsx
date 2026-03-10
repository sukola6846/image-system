import { ConfigProvider } from 'antd';
import { useThemeSync } from './hooks/useThemeSync';
import { useAntdTheme } from './hooks/useAntdTheme';
import Home from './pages/home';
import AdminLayout from './components/layout/adminLayout';

function App() {
  useThemeSync();
  const antdTheme = useAntdTheme();

  return (
    <ConfigProvider theme={antdTheme}>
      <AdminLayout>
        <Home />
      </AdminLayout>
    </ConfigProvider>
  );
}

export default App;

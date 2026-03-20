import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import './styles/view-transitions.css';
import App from './App.tsx';
import { queryClient } from './lib/queryClient';

// react-activation 与 StrictMode/createRoot 不兼容，需移除 StrictMode
async function bootstrap() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }

  createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

void bootstrap();

import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { publicRoutes, protectedRoutes } from './routes';
import { RootLayout } from '@/components/layout/RootLayout';

/** 根路由 loader：确保每次导航都有 loading 状态，驱动进度条显示 */
const rootLoader = async () => {
  await new Promise((r) => setTimeout(r, 80));
  return null;
};

const rootRoutes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    loader: rootLoader,
    shouldRevalidate: () => true,
    children: [
      ...publicRoutes.map((r) => ({ ...r, path: r.path === '/login' ? 'login' : r.path })),
      ...protectedRoutes.map((r) => (r.path === '/' ? { ...r, path: '' } : r)),
    ] as RouteObject[],
  },
];

const router = createBrowserRouter(rootRoutes);

export function Router() {
  return <RouterProvider router={router} />;
}

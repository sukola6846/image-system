import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { publicRoutes, protectedRoutes } from './routes';

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes] as RouteObject[]);

export function Router() {
  return <RouterProvider router={router} />;
}

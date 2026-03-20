import { http, HttpResponse } from 'msw';

const mockUser = {
  id: '1',
  name: '管理员',
  roles: ['admin'] as const,
  permissions: ['image:read', 'settings:manage'],
};

export const userHandlers = [
  http.get('/api/user/me', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) {
      return HttpResponse.json({ code: 40101, data: null, message: '未登录' }, { status: 401 });
    }

    return HttpResponse.json({ code: 0, data: mockUser, message: 'ok' }, { status: 200 });
  }),
];

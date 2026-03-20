import { http, HttpResponse } from 'msw';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { username: string; password: string };

    if (body.username === 'admin' && body.password === '123456') {
      return HttpResponse.json(
        {
          code: 0,
          data: {
            user: {
              id: '1',
              name: '管理员',
              roles: ['admin'],
              permissions: ['image:read', 'settings:manage'],
            },
          },
          message: 'ok',
        },
        {
          status: 200,
          headers: {
            Authorization: 'Bearer mock-jwt-admin',
          },
        }
      );
    }

    // HTTP 200 + code !== 0：走“业务错误”分支
    return HttpResponse.json({ code: 10001, data: null, message: '用户名或密码错误' }, { status: 200 });
  }),
];

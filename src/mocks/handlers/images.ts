import { http, HttpResponse } from 'msw';

function buildItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `示例图片 ${i + 1}.png`,
    url: `https://picsum.photos/seed/img${i + 1}/400/300`,
    createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
  }));
}

export const imagesHandlers = [
  http.get('/api/images', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) {
      return HttpResponse.json({ code: 40101, data: null, message: '未登录' }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10');

    const all = buildItems(10);
    const start = (page - 1) * pageSize;
    const items = all.slice(start, start + pageSize);

    return HttpResponse.json({ code: 0, data: { items, total: all.length }, message: 'ok' }, { status: 200 });
  }),
];

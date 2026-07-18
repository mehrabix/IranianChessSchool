import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:3000/api/courses', ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (id) {
      if (id === 'nonexistent') {
        return HttpResponse.json({ error: 'Course not found' }, { status: 404 });
      }
      return HttpResponse.json({
        course: { id, title: 'Test Course', description: 'A test course', level: 'BEGINNER', published: true },
        modules: [],
      });
    }
    return HttpResponse.json({
      courses: [
        { id: '1', title: 'Course 1', description: 'First course', level: 'BEGINNER', published: true },
        { id: '2', title: 'Course 2', description: 'Second course', level: 'INTERMEDIATE', published: true },
      ],
    });
  }),

  http.post('http://localhost:3000/api/contact', async ({ request }) => {
    const body: any = await request.json();
    if (!body.name || !body.email || !body.message) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    return HttpResponse.json({ success: true });
  }),

  http.post('http://localhost:3000/api/auth/register', async ({ request }) => {
    const body: any = await request.json();
    if (!body.name || !body.email || !body.password) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (body.email === 'existing@test.com') {
      return HttpResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
    return HttpResponse.json({ id: 'new-user', name: body.name, email: body.email });
  }),
];

export const errorHandler = http.all('*', () => {
  return new HttpResponse(null, { status: 500 });
});

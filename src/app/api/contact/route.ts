import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
  }

  // For now, log the contact submission
  console.log('Contact form submission:', { name, email, subject, message });

  return NextResponse.json({ success: true, message: 'Message received. We will get back to you soon.' });
}

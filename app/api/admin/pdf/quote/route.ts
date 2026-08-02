import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const KEY = process.env.ADMIN_API_KEY ?? '';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  const res = await fetch(`${API}/pdf/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': KEY },
    body: JSON.stringify(body),
  });

  if (res.status === 401) {
    console.error('[admin/pdf/quote] rejected: ADMIN_API_KEY does not match backend. Check ADMIN_API_KEY env var.');
  }
  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json({ error: 'Failed to generate PDF', detail }, { status: res.status });
  }

  const buf = await res.arrayBuffer();
  return new NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': res.headers.get('Content-Disposition') || 'attachment; filename=cenova-nabidka.pdf',
    },
  });
}

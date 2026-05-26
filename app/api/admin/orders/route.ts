import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';

const API = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const KEY = process.env.ADMIN_API_KEY ?? '';

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { orderNum } = await req.json();
  const res = await fetch(`${API}/orders/${orderNum}`, {
    method: 'DELETE',
    headers: { 'X-Admin-Key': KEY },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const headers = { 'X-Admin-Key': KEY };

  const [ordersRes, statsRes] = await Promise.all([
    fetch(`${API}/orders?limit=500`, { headers }),
    fetch(`${API}/stats`, { headers }),
  ]);

  const orders = await ordersRes.json();
  const stats = await statsRes.json();

  return NextResponse.json({ orders, stats });
}

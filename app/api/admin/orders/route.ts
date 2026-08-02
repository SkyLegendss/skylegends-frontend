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

  if (res.status === 401) {
    console.error('[admin/orders] DELETE rejected: ADMIN_API_KEY does not match backend. Check ADMIN_API_KEY env var.');
  } else if (!res.ok) {
    console.error(`[admin/orders] DELETE failed with status ${res.status}:`, data);
  }

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

  if (ordersRes.status === 401 || statsRes.status === 401) {
    console.error('[admin/orders] GET rejected: ADMIN_API_KEY does not match backend. Check ADMIN_API_KEY env var.');
    return NextResponse.json({ error: 'Unauthorized: invalid ADMIN_API_KEY' }, { status: 401 });
  }

  if (!ordersRes.ok || !statsRes.ok) {
    console.error(`[admin/orders] GET failed: orders=${ordersRes.status} stats=${statsRes.status}`);
    return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 502 });
  }

  const orders = await ordersRes.json();
  const stats = await statsRes.json();

  return NextResponse.json({ orders, stats });
}

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const KEY = process.env.ADMIN_API_KEY ?? '';

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { orderNum, status } = await req.json();

  const res = await fetch(`${API}/orders/${orderNum}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': KEY },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();

  if (res.status === 401) {
    console.error('[admin/status] PATCH rejected: ADMIN_API_KEY does not match backend. Check ADMIN_API_KEY env var.');
  } else if (!res.ok) {
    console.error(`[admin/status] PATCH failed with status ${res.status}:`, data);
  }

  return NextResponse.json(data, { status: res.status });
}

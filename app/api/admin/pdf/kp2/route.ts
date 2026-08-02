import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const KEY = process.env.ADMIN_API_KEY ?? '';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const orderNum = searchParams.get('order_num');
  if (!orderNum) return NextResponse.json({ error: 'Missing order_num' }, { status: 400 });

  const qs = new URLSearchParams();
  for (const key of [
    'climber_days', 'climber_total', 'buildings',
    'mrizky_per_building', 'mrizky_price_with_vat', 'consumables_per_building',
  ]) {
    const v = searchParams.get(key);
    if (v !== null) qs.set(key, v);
  }

  const res = await fetch(`${API}/orders/${orderNum}/pdf/kp2?${qs.toString()}`, {
    headers: { 'X-Admin-Key': KEY },
  });

  if (res.status === 401) {
    console.error('[admin/pdf/kp2] rejected: ADMIN_API_KEY does not match backend. Check ADMIN_API_KEY env var.');
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
      'Content-Disposition': res.headers.get('Content-Disposition') || `attachment; filename=nabidka-kp2-${orderNum}.pdf`,
    },
  });
}

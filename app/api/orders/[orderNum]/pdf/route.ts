import { NextResponse } from 'next/server';

const API = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(_req: Request, { params }: { params: { orderNum: string } }) {
  const res = await fetch(`${API}/orders/${params.orderNum}/pdf`);
  if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const buf = await res.arrayBuffer();
  return new NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=nabidka-${params.orderNum}.pdf`,
    },
  });
}

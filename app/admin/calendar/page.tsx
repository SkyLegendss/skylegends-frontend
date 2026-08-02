'use client';
import { useEffect, useMemo, useState } from 'react';
import { STATUS_LABELS } from '@/lib/adminStatus';

type Order = {
  id: string; order_num: string; location: string; status: string;
  service_date?: string; total_area: number;
  clients?: { name: string; email: string };
};

const MONTH_NAMES = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
];
const WEEKDAYS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function CalendarPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/orders');
        if (res.status === 401) { setError('Přístup odepřen.'); return; }
        const { orders: o } = await res.json();
        setOrders((o?.data || []).filter((x: Order) => !!x.service_date));
      } catch {
        setError('Nepodařilo se načíst data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const byDate = useMemo(() => {
    const map = new Map<string, Order[]>();
    orders.forEach(o => {
      if (!o.service_date) return;
      const key = o.service_date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(o);
    });
    return map;
  }, [orders]);

  const weeks = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    // Monday-first offset
    const startOffset = (firstDay.getDay() + 6) % 7;
    const gridStart = new Date(year, month, 1 - startOffset);

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      days.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
    }
    const result: Date[][] = [];
    for (let i = 0; i < 42; i += 7) result.push(days.slice(i, i + 7));
    return result;
  }, [cursor]);

  const today = toKey(new Date());
  const selectedOrders = selectedKey ? byDate.get(selectedKey) || [] : [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Kalendář</h1>
          <p className="text-white/35 text-sm mt-1">
            Termíny realizace podle data uvedeného v objednávce.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCursor(c => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
            className="w-8 h-8 border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
          >
            ‹
          </button>
          <span className="text-white text-sm font-semibold w-36 text-center">
            {MONTH_NAMES[cursor.getMonth()]} {cursor.getFullYear()}
          </span>
          <button
            onClick={() => setCursor(c => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
            className="w-8 h-8 border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
          >
            ›
          </button>
          <button
            onClick={() => setCursor(() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1); })}
            className="text-xs px-3 py-2 border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
          >
            Dnes
          </button>
        </div>
      </div>

      {error && (
        <div className="border border-red-500/30 bg-red-500/8 text-red-400 px-5 py-3 text-sm mb-6">{error}</div>
      )}

      <div className="flex gap-4 items-start">
        <div className="flex-[3] min-w-0">
          <div className="grid grid-cols-7 gap-px bg-white/10 mb-px">
            {WEEKDAYS.map(w => (
              <div key={w} className="bg-[#1a1a1a] text-center text-xs font-semibold text-white/30 uppercase tracking-widest py-2">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-white/10">
            {weeks.flat().map((day, i) => {
              const key = toKey(day);
              const inMonth = day.getMonth() === cursor.getMonth();
              const dayOrders = byDate.get(key) || [];
              const isSelected = selectedKey === key;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedKey(dayOrders.length ? (isSelected ? null : key) : null)}
                  className={`bg-[#161616] text-left p-2 min-h-[86px] align-top transition-colors ${
                    inMonth ? '' : 'opacity-30'
                  } ${isSelected ? 'ring-1 ring-white/40' : ''} ${dayOrders.length ? 'hover:bg-[#1e1e1e] cursor-pointer' : 'cursor-default'}`}
                >
                  <div className={`text-xs mb-1.5 ${key === today ? 'text-white font-black' : 'text-white/40'}`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayOrders.slice(0, 3).map(o => {
                      const st = STATUS_LABELS[o.status];
                      return (
                        <div key={o.id} className={`text-[10px] px-1.5 py-0.5 truncate ${st?.color || 'border border-white/10 text-white/40'}`}>
                          {o.order_num}
                        </div>
                      );
                    })}
                    {dayOrders.length > 3 && (
                      <div className="text-[10px] text-white/25">+{dayOrders.length - 3} další</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Day detail panel */}
        <div className="flex-[1] min-w-[240px]">
          <div className="bg-[#161616] border border-white/10 p-5 min-h-[200px]">
            {!selectedKey ? (
              <div className="text-white/25 text-sm">
                {loading ? 'Načítání...' : 'Vyberte den se zakázkami pro zobrazení detailu.'}
              </div>
            ) : (
              <>
                <div className="text-xs text-white/30 uppercase tracking-widest mb-3">{selectedKey}</div>
                <div className="space-y-3">
                  {selectedOrders.map(o => {
                    const st = STATUS_LABELS[o.status] || { label: o.status, color: 'border border-white/10 text-white/40' };
                    return (
                      <div key={o.id} className="border-b border-white/8 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-semibold text-white">{o.order_num}</span>
                          <span className={`text-xs px-1.5 py-0.5 border font-medium ${st.color}`}>{st.label}</span>
                        </div>
                        <div className="text-xs text-white/40">{o.clients?.name || '—'}</div>
                        <div className="text-xs text-white/25 truncate">{o.location}</div>
                        <div className="text-xs text-white/25">{o.total_area} m²</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

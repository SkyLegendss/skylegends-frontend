'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { STATUS_DOT } from '@/lib/adminStatus';
import { useAdminOrders, type Order } from '@/lib/useAdminOrders';

const MONTH_NAMES = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
];
const WEEKDAYS = ['PO', 'ÚT', 'ST', 'ČT', 'PÁ', 'SO', 'NE'];
const WEEKDAY_FULL = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function CalendarPage() {
  const { orders: allOrders, isLoading: loading, error } = useAdminOrders();
  const orders = useMemo(() => allOrders.filter(o => !!o.service_date), [allOrders]);

  const todayKey = useMemo(() => toKey(new Date()), []);
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedKey, setSelectedKey] = useState<string>(todayKey);

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

  const selectedDate = useMemo(() => {
    const [y, m, d] = selectedKey.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [selectedKey]);
  const selectedOrders = byDate.get(selectedKey) || [];

  const goToday = () => {
    const n = new Date();
    setCursor(new Date(n.getFullYear(), n.getMonth(), 1));
    setSelectedKey(todayKey);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Kalendář</h1>
        <p className="text-white/35 text-sm mt-1">Termíny realizace podle data uvedeného v objednávce.</p>
      </div>

      {error && (
        <div className="border border-red-500/30 bg-red-500/8 text-red-400 px-5 py-3 text-sm mb-6">
          {error.status === 401 ? 'Přístup odepřen.' : 'Nepodařilo se načíst data.'}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* Agenda card */}
        <div className="relative w-full lg:w-[300px] shrink-0 rounded-[28px] overflow-hidden bg-gradient-to-br from-[#1b2431] via-[#151b25] to-ink p-7 min-h-[420px]">
          <div
            className="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative">
            <div className="flex items-start gap-4 mb-8">
              <div className="text-6xl font-black text-white leading-none">
                {String(selectedDate.getDate()).padStart(2, '0')}
              </div>
              <div className="pt-1.5">
                <div className="text-accent text-sm font-bold">{MONTH_NAMES[selectedDate.getMonth()]}</div>
                <div className="text-white/45 text-xs uppercase tracking-widest mt-0.5">
                  {WEEKDAY_FULL[selectedDate.getDay()]}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-white/30 text-sm">Načítání...</div>
            ) : selectedOrders.length === 0 ? (
              <div className="text-white/30 text-sm">Žádné zakázky v tento den.</div>
            ) : (
              <div className="space-y-5">
                {selectedOrders.map(o => (
                  <div key={o.id} className="flex gap-3">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${STATUS_DOT[o.status] || 'bg-white/40'}`} />
                    <div className="min-w-0">
                      <div className="text-white/40 text-[11px] uppercase tracking-wider mb-0.5">Celý den</div>
                      <div className="text-white text-sm font-semibold truncate">{o.clients?.name || o.order_num}</div>
                      <div className="text-white/40 text-xs truncate">{o.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Month card */}
        <div className="flex-1 min-w-0 w-full rounded-[28px] bg-[#161616] border border-white/8 p-7">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCursor(c => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
              className="w-9 h-9 rounded-full border border-white/10 text-white/50 hover:text-accent hover:border-accent/40 transition-colors flex items-center justify-center shrink-0"
            >
              ‹
            </button>
            <div className="text-center">
              <button onClick={goToday} className="text-white/25 text-xs font-semibold hover:text-accent transition-colors">
                {cursor.getFullYear()} · Dnes
              </button>
              <div className="text-white text-2xl font-black tracking-tight">{MONTH_NAMES[cursor.getMonth()]}</div>
            </div>
            <button
              onClick={() => setCursor(c => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
              className="w-9 h-9 rounded-full border border-white/10 text-white/50 hover:text-accent hover:border-accent/40 transition-colors flex items-center justify-center shrink-0"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map(w => (
              <div key={w} className="text-center text-[11px] font-semibold text-white/25 tracking-widest py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1.5">
            {weeks.flat().map((day, i) => {
              const key = toKey(day);
              const inMonth = day.getMonth() === cursor.getMonth();
              const dayOrders = byDate.get(key) || [];
              const isSelected = selectedKey === key;
              const isToday = key === todayKey;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setSelectedKey(key)}
                    className={`w-9 h-9 rounded-full text-sm transition-colors ${
                      isSelected
                        ? 'bg-accent text-ink font-bold'
                        : isToday
                          ? 'border border-accent text-accent font-semibold'
                          : inMonth
                            ? 'text-white/70 hover:bg-white/10'
                            : 'text-white/15 hover:bg-white/5'
                    }`}
                  >
                    {day.getDate()}
                  </button>
                  <div className="flex gap-0.5 h-1.5">
                    {dayOrders.slice(0, 3).map(o => (
                      <span key={o.id} className={`w-1 h-1 rounded-full ${STATUS_DOT[o.status] || 'bg-white/40'}`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-6">
            <Link
              href="/order"
              title="Nová objednávka"
              className="w-12 h-12 rounded-full bg-accent text-ink flex items-center justify-center text-2xl font-black hover:bg-accent/90 transition-colors"
            >
              +
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

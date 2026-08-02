'use client';
import Link from 'next/link';
import { STATUS_LABELS } from '@/lib/adminStatus';
import { useAdminOrders } from '@/lib/useAdminOrders';

const TILES = [
  {
    href: '/admin/database', title: 'Databáze', icon: '▤',
    desc: 'Objednávky a klienti — vyhledávání, statusy, export CSV.',
  },
  {
    href: '/admin/calendar', title: 'Kalendář', icon: '▦',
    desc: 'Přehled naplánovaných termínů podle data realizace.',
  },
  {
    href: '/admin/pdf', title: 'Generátor PDF', icon: '▥',
    desc: 'Sestavení a stažení cenové nabídky pro konkrétní zakázku.',
  },
];

export default function AdminHome() {
  const { orders, stats, isLoading: loading, error } = useAdminOrders();

  const recent = orders.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">Přehled</h1>
        <p className="text-white/35 text-sm mt-1">Souhrn aktuálního stavu zakázek a rychlý přístup k sekcím administrace.</p>
      </div>

      {error && (
        <div className="border border-red-500/30 bg-red-500/8 text-red-400 px-5 py-3 text-sm mb-6">
          {error.status === 401 ? 'Přístup odepřen.' : 'Nepodařilo se načíst data.'}
        </div>
      )}

      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 mb-8">
        {[
          ['Objednávky', loading ? '—' : stats?.total_orders ?? 0],
          ['Klienti', loading ? '—' : stats?.total_clients ?? 0],
          ['Celková plocha', loading ? '—' : `${(stats?.total_area ?? 0).toLocaleString('cs-CZ')} m²`],
          ['Obrat', loading ? '—' : `${(stats?.total_revenue ?? 0).toLocaleString('cs-CZ')} Kč`],
        ].map(([label, value]) => (
          <div key={label as string} className="bg-[#161616] px-6 py-5">
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-xs text-white/30 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      {stats && (
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(STATUS_LABELS).map(([key, meta]) => (
            <div key={key} className={`text-xs px-3 py-1.5 font-medium ${meta.color}`}>
              {meta.label}: {stats.by_status[key] ?? 0}
            </div>
          ))}
        </div>
      )}

      {/* Navigation tiles */}
      <div className="grid md:grid-cols-3 gap-px bg-white/10 mb-8">
        {TILES.map(t => (
          <Link
            key={t.href}
            href={t.href}
            className="bg-[#161616] hover:bg-[#1e1e1e] p-6 transition-colors duration-200 group"
          >
            <div className="text-white/20 text-2xl mb-4">{t.icon}</div>
            <div className="text-white font-bold text-sm mb-2 flex items-center gap-2">
              {t.title}
              <span className="text-white/20 group-hover:translate-x-1 transition-transform duration-200">→</span>
            </div>
            <div className="text-white/35 text-xs leading-relaxed">{t.desc}</div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-black text-white uppercase tracking-widest">Poslední objednávky</h2>
          <Link href="/admin/database" className="text-xs text-white/40 hover:text-white transition-colors">
            Zobrazit vše →
          </Link>
        </div>
        <div className="bg-[#161616] border border-white/10 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-white/25 text-sm">Načítání...</div>
          ) : recent.length === 0 ? (
            <div className="p-10 text-center text-white/25 text-sm">Zatím žádné objednávky</div>
          ) : (
            <div className="divide-y divide-white/8">
              {recent.map(o => {
                const st = STATUS_LABELS[o.status] || { label: o.status, color: 'border border-white/10 text-white/40' };
                return (
                  <div key={o.id} className="px-5 py-3 flex justify-between items-center gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs font-semibold text-white">{o.order_num}</span>
                        <span className={`text-xs px-1.5 py-0.5 border font-medium ${st.color}`}>{st.label}</span>
                      </div>
                      <div className="text-xs text-white/30 truncate">
                        {o.clients?.name || '—'} · {o.location}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-white text-xs font-medium">{o.total_area} m²</div>
                      <div className="text-xs text-white/25">{new Date(o.created_at).toLocaleDateString('cs-CZ')}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

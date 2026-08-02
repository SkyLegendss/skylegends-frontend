'use client';
import { useMemo, useState } from 'react';
import { useAdminOrders, type Order } from '@/lib/useAdminOrders';

const API_PUBLIC = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Kp2Form = {
  climber_days: string; climber_total: string; buildings: string;
  mrizky_per_building: string; mrizky_price_with_vat: string; consumables_per_building: string;
};

const KP2_DEFAULTS: Kp2Form = {
  climber_days: '3', climber_total: '48000', buildings: '4',
  mrizky_per_building: '132', mrizky_price_with_vat: '139', consumables_per_building: '500',
};

const KP2_FIELDS: { key: keyof Kp2Form; label: string }[] = [
  { key: 'climber_days', label: 'Počet dnů horolezce' },
  { key: 'climber_total', label: 'Cena za práci horolezce (Kč)' },
  { key: 'buildings', label: 'Počet domů' },
  { key: 'mrizky_per_building', label: 'Mřížek na dům (ks)' },
  { key: 'mrizky_price_with_vat', label: 'Cena mřížky s DPH (Kč/ks)' },
  { key: 'consumables_per_building', label: 'Spotřební materiál na dům (Kč)' },
];

export default function OrderPdfGenerator() {
  const { orders, isLoading: loading, error } = useAdminOrders();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [template, setTemplate] = useState<'kp1' | 'kp2'>('kp1');
  const [form, setForm] = useState<Kp2Form>(KP2_DEFAULTS);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return orders.slice(0, 30);
    return orders.filter(o =>
      o.order_num.toLowerCase().includes(q) ||
      o.clients?.name?.toLowerCase().includes(q) ||
      o.clients?.email?.toLowerCase().includes(q)
    ).slice(0, 30);
  }, [orders, search]);

  const setField = (k: keyof Kp2Form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const generateKp2 = async () => {
    if (!selected) return;
    setGenerating(true);
    setGenError('');
    try {
      const qs = new URLSearchParams({ order_num: selected.order_num, ...form });
      const res = await fetch(`/api/admin/pdf/kp2?${qs.toString()}`);
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Nepodařilo se vygenerovat PDF');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (e: any) {
      setGenError(e.message || 'Chyba při generování PDF');
    } finally {
      setGenerating(false);
    }
  };

  const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/40 transition-colors duration-200";

  return (
    <div>
      {error && (
        <div className="border border-red-500/30 bg-red-500/8 text-red-400 px-5 py-3 text-sm mb-6">
          {error.status === 401 ? 'Přístup odepřen.' : 'Nepodařilo se načíst data.'}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Order picker */}
        <div className="border border-white/8 p-6">
          <h2 className="font-black text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-3">
            <span className="text-white/20">01</span>
            Zakázka
          </h2>
          <input
            type="text"
            placeholder="Hledat podle čísla, jména, e-mailu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={inputClass + ' mb-3'}
          />
          <div className="border border-white/10 max-h-64 overflow-y-auto divide-y divide-white/8">
            {loading ? (
              <div className="p-6 text-center text-white/25 text-sm">Načítání...</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center text-white/25 text-sm">Nic nenalezeno</div>
            ) : (
              filtered.map(o => (
                <button
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className={`w-full text-left px-4 py-2.5 transition-colors ${
                    selected?.id === o.id ? 'bg-[#252525]' : 'hover:bg-[#1e1e1e]'
                  }`}
                >
                  <div className="font-mono text-xs font-semibold text-white">{o.order_num}</div>
                  <div className="text-xs text-white/30 truncate">{o.clients?.name} · {o.location}</div>
                </button>
              ))
            )}
          </div>
          {selected && (
            <div className="mt-3 text-xs text-white/40">
              Vybráno: <span className="text-white font-semibold">{selected.order_num}</span>
            </div>
          )}
        </div>

        {/* Template + generation */}
        <div className="border border-white/8 p-6">
          <h2 className="font-black text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-3">
            <span className="text-white/20">02</span>
            Šablona
          </h2>
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setTemplate('kp1')}
              className={`flex-1 text-xs font-semibold px-3 py-2.5 border transition-colors ${
                template === 'kp1' ? 'bg-white text-black border-white' : 'border-white/15 text-white/50 hover:border-white/30'
              }`}
            >
              KP1 · Mytí dronem
            </button>
            <button
              onClick={() => setTemplate('kp2')}
              className={`flex-1 text-xs font-semibold px-3 py-2.5 border transition-colors ${
                template === 'kp2' ? 'bg-white text-black border-white' : 'border-white/15 text-white/50 hover:border-white/30'
              }`}
            >
              KP2 · Horolezec + mřížky
            </button>
          </div>

          {template === 'kp1' ? (
            <div>
              <p className="text-white/35 text-xs leading-relaxed mb-4">
                Standardní nabídka na mytí fasády a oken dronem, vypočtená z ploch uvedených v objednávce.
              </p>
              {selected ? (
                <a
                  href={`${API_PUBLIC}/orders/${selected.order_num}/pdf`}
                  target="_blank" rel="noopener"
                  className="block w-full text-center bg-white text-black py-3 text-xs font-black tracking-widest uppercase hover:bg-white/90 transition-colors duration-200"
                >
                  Otevřít / stáhnout PDF
                </a>
              ) : (
                <div className="text-center text-white/25 text-xs py-3 border border-white/10">
                  Nejprve vyberte zakázku
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {KP2_FIELDS.map(f => (
                  <div key={f.key}>
                    <label className="block text-xs text-white/40 mb-1">{f.label}</label>
                    <input
                      type="number"
                      value={form[f.key]}
                      onChange={e => setField(f.key)(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
              {genError && (
                <div className="border border-red-500/30 bg-red-500/8 text-red-400 px-4 py-2 text-xs mb-3">
                  {genError}
                </div>
              )}
              <button
                onClick={generateKp2}
                disabled={!selected || generating}
                className="w-full bg-white text-black py-3 text-xs font-black tracking-widest uppercase hover:bg-white/90 disabled:bg-white/20 disabled:text-white/30 transition-colors duration-200"
              >
                {generating ? 'Generuji...' : !selected ? 'Nejprve vyberte zakázku' : 'Vygenerovat a otevřít PDF'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

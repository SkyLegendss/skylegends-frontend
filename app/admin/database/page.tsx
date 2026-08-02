'use client';
import { useEffect, useState, useMemo } from 'react';
import { STATUS_LABELS } from '@/lib/adminStatus';

const API_PUBLIC = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Order = {
  id: string; order_num: string; created_at: string;
  location: string; facade_area: number; window_area: number;
  total_area: number; total_price: number; status: string;
  pdf_url?: string; notes?: string; service_date?: string;
  clients?: { name: string; email: string; phone: string; company?: string };
};

type ClientInfo = {
  name: string; email: string; phone: string; company?: string;
  orderCount: number; totalSpent: number;
};

export default function DatabasePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientInfo | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/orders');
      if (res.status === 401) { setError('Přístup odepřen.'); return; }
      const { orders: o } = await res.json();
      setOrders(o?.data || []);
    } catch {
      setError('Nepodařilo se načíst data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (orderNum: string, status: string) => {
    await fetch('/api/admin/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNum, status }),
    });
    fetchData();
  };

  const deleteOrder = async (orderNum: string) => {
    await fetch('/api/admin/orders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNum }),
    });
    setConfirmDelete(null);
    fetchData();
  };

  const exportCSV = () => {
    const headers = ['Č. objednávky', 'Datum', 'Klient', 'E-mail', 'Telefon', 'Firma',
      'Místo', 'Fasáda m²', 'Okna m²', 'Celkem m²', 'Status', 'Termín'];
    const rows = orders.map(o => [
      o.order_num,
      new Date(o.created_at).toLocaleDateString('cs-CZ'),
      o.clients?.name || '', o.clients?.email || '',
      o.clients?.phone || '', o.clients?.company || '',
      o.location, o.facade_area, o.window_area, o.total_area,
      STATUS_LABELS[o.status]?.label || o.status, o.service_date || '',
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const csv = '﻿' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `skylegends-objednavky-${Date.now()}.csv`;
    a.click();
  };

  const uniqueClients = useMemo<ClientInfo[]>(() => {
    const map = new Map<string, ClientInfo>();
    orders.forEach(o => {
      if (!o.clients?.email) return;
      const key = o.clients.email;
      if (!map.has(key)) map.set(key, { ...o.clients, orderCount: 0, totalSpent: 0 });
      const c = map.get(key)!;
      c.orderCount++;
      c.totalSpent += Number(o.total_price) || 0;
    });
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filteredClients = useMemo(() => {
    const q = clientSearch.toLowerCase();
    if (!q) return uniqueClients;
    return uniqueClients.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q)
    );
  }, [uniqueClients, clientSearch]);

  const filteredOrders = useMemo(() => {
    const q = orderSearch.toLowerCase();
    return orders.filter(o =>
      o.order_num.toLowerCase().includes(q) ||
      o.clients?.name?.toLowerCase().includes(q) ||
      o.clients?.email?.toLowerCase().includes(q) ||
      o.location?.toLowerCase().includes(q) ||
      o.clients?.company?.toLowerCase().includes(q)
    );
  }, [orders, orderSearch]);

  const clientOrders = useMemo(() =>
    selectedClient ? orders.filter(o => o.clients?.email === selectedClient.email) : [],
    [orders, selectedClient]
  );

  const inputClass = "flex-1 text-sm outline-none text-white placeholder:text-white/25 bg-transparent";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {error && (
        <div className="border border-red-500/30 bg-red-500/8 text-red-400 px-5 py-3 text-sm mb-6">
          {error} —{' '}
          <button onClick={fetchData} className="underline hover:no-underline">Zkusit znovu</button>
        </div>
      )}

      <div className="flex gap-4 items-start">

        {/* Orders — 75% */}
        <div className="flex-[3] min-w-0">
          <div className="bg-[#1a1a1a] border border-white/10 px-4 py-3 mb-2 flex gap-3 items-center">
            <input
              type="text"
              placeholder="Hledat objednávky..."
              value={orderSearch}
              onChange={e => setOrderSearch(e.target.value)}
              className={inputClass}
            />
            {orderSearch && (
              <button onClick={() => setOrderSearch('')} className="text-white/30 hover:text-white text-xs transition-colors">
                Zrušit
              </button>
            )}
            <span className="text-xs text-white/20 shrink-0">{filteredOrders.length} záznamů</span>
            <button
              onClick={exportCSV}
              className="text-xs px-3 py-1.5 border border-white/10 text-white/50 hover:border-white/30 hover:text-white transition-colors duration-200 shrink-0"
            >
              Export CSV
            </button>
          </div>

          <div className="bg-[#161616] border border-white/10 overflow-hidden">
            {loading ? (
              <div className="p-16 text-center text-white/25 text-sm">Načítání dat...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-16 text-center text-white/25 text-sm">
                {orders.length === 0 ? 'Zatím žádné objednávky' : 'Nic nebylo nalezeno'}
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0">
                    <tr className="border-b border-white/10 bg-[#222] text-left">
                      {['Č. obj.', 'Datum', 'Klient', 'Místo', 'Plocha', 'Status', 'PDF'].map((h, i) => (
                        <th key={i} className="px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                      <th className="px-4 py-3 w-[130px]" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {filteredOrders.map(o => {
                      const st = STATUS_LABELS[o.status] || { label: o.status, color: 'border border-white/10 text-white/40' };
                      const isConfirming = confirmDelete === o.order_num;
                      return (
                        <tr key={o.id} className="bg-[#161616] hover:bg-[#1e1e1e] transition-colors group">
                          <td className="px-4 py-3">
                            <span className="font-mono font-semibold text-white text-xs">{o.order_num}</span>
                          </td>
                          <td className="px-4 py-3 text-white/35 whitespace-nowrap text-xs">
                            {new Date(o.created_at).toLocaleDateString('cs-CZ')}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => {
                                const c = uniqueClients.find(c => c.email === o.clients?.email);
                                if (c) setSelectedClient(prev => prev?.email === c.email ? null : c);
                              }}
                              className="text-left hover:opacity-70 transition-opacity"
                            >
                              <div className="font-medium text-white text-xs">{o.clients?.name || '—'}</div>
                              <div className="text-xs text-white/30">{o.clients?.email}</div>
                            </button>
                          </td>
                          <td className="px-4 py-3 text-white/35 max-w-[120px] truncate text-xs" title={o.location}>
                            {o.location}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-white text-xs font-medium">{o.total_area} m²</div>
                            <div className="text-xs text-white/25">{o.facade_area}F + {o.window_area}O</div>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={o.status}
                              onChange={e => updateStatus(o.order_num, e.target.value)}
                              className={`text-xs font-semibold px-2 py-1 bg-transparent border outline-none cursor-pointer ${st.color}`}
                            >
                              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                                <option key={v} value={v} className="bg-black text-white">{l.label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <a
                              href={o.pdf_url || `${API_PUBLIC}/orders/${o.order_num}/pdf`}
                              target="_blank" rel="noopener"
                              className="text-xs text-white/40 hover:text-white transition-colors underline"
                            >
                              PDF
                            </a>
                          </td>
                          <td className="px-4 py-3 w-[130px] whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {/* × — always in DOM, hidden via invisible when confirming */}
                              <button
                                onClick={() => setConfirmDelete(o.order_num)}
                                className={`text-white/70 hover:text-red-400 transition-colors text-base leading-none font-light ${isConfirming ? 'invisible absolute' : ''}`}
                                title="Smazat záznam"
                              >
                                ×
                              </button>
                              {/* Confirmation — always in DOM, hidden when not confirming */}
                              <span className={`flex items-center gap-2 ${isConfirming ? '' : 'invisible absolute'}`}>
                                <button
                                  onClick={() => deleteOrder(o.order_num)}
                                  className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
                                >
                                  Smazat
                                </button>
                                <span className="text-white/20 text-xs">·</span>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="text-xs text-white/40 hover:text-white transition-colors"
                                >
                                  Zrušit
                                </button>
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Clients — 25% */}
        <div className="flex-[1] min-w-0">
          <div className="bg-[#1a1a1a] border border-white/10 px-4 py-3 mb-2 flex gap-3 items-center">
            <input
              type="text"
              placeholder="Hledat klienta..."
              value={clientSearch}
              onChange={e => setClientSearch(e.target.value)}
              className={inputClass}
            />
            {clientSearch && (
              <button onClick={() => setClientSearch('')} className="text-white/30 hover:text-white text-xs transition-colors">
                Zrušit
              </button>
            )}
            <span className="text-xs text-white/20 shrink-0">{filteredClients.length}</span>
          </div>

          <div className="bg-[#161616] border border-white/10 overflow-hidden mb-2">
            {loading ? (
              <div className="p-10 text-center text-white/25 text-sm">Načítání...</div>
            ) : filteredClients.length === 0 ? (
              <div className="p-10 text-center text-white/25 text-sm">
                {uniqueClients.length === 0 ? 'Zatím žádní klienti' : 'Nikdo nenalezen'}
              </div>
            ) : (
              <div className="divide-y divide-white/8 max-h-[320px] overflow-y-auto">
                {filteredClients.map(c => (
                  <button
                    key={c.email}
                    onClick={() => setSelectedClient(prev => prev?.email === c.email ? null : c)}
                    className={`w-full text-left px-4 py-3 transition-colors flex justify-between items-center gap-3 border-l-2 ${
                      selectedClient?.email === c.email
                        ? 'bg-[#252525] border-white'
                        : 'hover:bg-[#1e1e1e] border-transparent'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-white text-xs truncate">{c.name}</div>
                      <div className="text-xs text-white/30 truncate">{c.email}</div>
                      {c.company && <div className="text-xs text-white/20 truncate">{c.company}</div>}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-white/60">{c.orderCount} obj.</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedClient && (
            <div className="bg-[#161616] border border-white/10 overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-semibold text-white text-sm">{selectedClient.name}</div>
                    <div className="text-xs text-white/40 mt-1">{selectedClient.email}</div>
                    <div className="text-xs text-white/40">{selectedClient.phone}</div>
                    {selectedClient.company && (
                      <div className="text-xs text-white/25 mt-0.5">{selectedClient.company}</div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="text-white/20 hover:text-white/60 transition-colors text-sm leading-none"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-px bg-white/10">
                  <div className="bg-[#1e1e1e] px-3 py-3 text-center">
                    <div className="text-xl font-black text-white">{selectedClient.orderCount}</div>
                    <div className="text-xs text-white/30">objednávky</div>
                  </div>
                  <div className="bg-[#1e1e1e] px-3 py-3 text-center">
                    <div className="text-sm font-black text-white">{selectedClient.totalSpent.toLocaleString('cs-CZ')}</div>
                    <div className="text-xs text-white/30">Kč celkem</div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-white/8 max-h-[280px] overflow-y-auto">
                {clientOrders.map(o => {
                  const st = STATUS_LABELS[o.status] || { label: o.status, color: 'border border-white/10 text-white/40' };
                  return (
                    <div key={o.id} className="px-5 py-3 flex justify-between items-center gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-xs font-semibold text-white">{o.order_num}</span>
                          <span className={`text-xs px-1.5 py-0.5 border font-medium ${st.color}`}>{st.label}</span>
                        </div>
                        <div className="text-xs text-white/30 truncate">
                          {new Date(o.created_at).toLocaleDateString('cs-CZ')} · {o.location}
                        </div>
                        <div className="text-xs text-white/25">{o.total_area} m²</div>
                      </div>
                      <a
                        href={o.pdf_url || `${API_PUBLIC}/orders/${o.order_num}/pdf`}
                        target="_blank" rel="noopener"
                        className="text-xs text-white/30 hover:text-white transition-colors underline shrink-0"
                      >
                        PDF
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

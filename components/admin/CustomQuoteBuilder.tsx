'use client';
import { useMemo, useState } from 'react';

type Item = {
  id: string; name: string; quantity: string; unit: string;
  showPrice: boolean; unitPrice: string;
};

const newItem = (): Item => ({
  id: Math.random().toString(36).slice(2),
  name: '', quantity: '1', unit: 'ks', showPrice: false, unitPrice: '',
});

const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors duration-200";
const checkboxLabel = "flex items-center gap-2 text-xs text-white/50 select-none cursor-pointer";

export default function CustomQuoteBuilder() {
  const [noRecipient, setNoRecipient] = useState(false);
  const [recipient, setRecipient] = useState({
    name: '', company: '', billing_address: '', ico: '', email: '', phone: '',
  });

  const [noItems, setNoItems] = useState(false);
  const [items, setItems] = useState<Item[]>([newItem()]);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [notes, setNotes] = useState('');

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const setRecipientField = (k: keyof typeof recipient) => (v: string) =>
    setRecipient(r => ({ ...r, [k]: v }));

  const updateItem = (id: string, patch: Partial<Item>) =>
    setItems(list => list.map(i => (i.id === id ? { ...i, ...patch } : i)));

  const removeItem = (id: string) =>
    setItems(list => (list.length > 1 ? list.filter(i => i.id !== id) : list));

  const total = useMemo(() => {
    if (noItems) return 0;
    return items.reduce((sum, i) => {
      if (!i.showPrice) return sum;
      const qty = parseFloat(i.quantity) || 0;
      const price = parseFloat(i.unitPrice) || 0;
      return sum + qty * price;
    }, 0);
  }, [items, noItems]);

  const generate = async () => {
    setGenerating(true);
    setError('');
    try {
      const payload = {
        recipient: noRecipient ? null : recipient,
        show_items: !noItems,
        items: noItems ? [] : items
          .filter(i => i.name.trim())
          .map(i => ({
            name: i.name,
            quantity: parseFloat(i.quantity) || 0,
            unit: i.unit || 'ks',
            show_price: i.showPrice,
            unit_price: i.showPrice ? (parseFloat(i.unitPrice) || 0) : null,
          })),
        title, location, service_date: serviceDate, notes,
      };
      const res = await fetch('/api/admin/pdf/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Nepodařilo se vygenerovat PDF');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (e: any) {
      setError(e.message || 'Chyba při generování PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Recipient */}
      <div className="border border-white/8 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-white text-xs uppercase tracking-widest flex items-center gap-3">
            <span className="text-white/20">01</span>
            Komu
          </h2>
          <label className={checkboxLabel}>
            <input type="checkbox" checked={noRecipient} onChange={e => setNoRecipient(e.target.checked)} />
            Neuvádět příjemce
          </label>
        </div>
        {!noRecipient && (
          <div className="grid grid-cols-2 gap-3">
            <input className={inputClass} placeholder="Jméno" value={recipient.name}
              onChange={e => setRecipientField('name')(e.target.value)} />
            <input className={inputClass} placeholder="Firma" value={recipient.company}
              onChange={e => setRecipientField('company')(e.target.value)} />
            <input className={inputClass + ' col-span-2'} placeholder="Fakturační adresa" value={recipient.billing_address}
              onChange={e => setRecipientField('billing_address')(e.target.value)} />
            <input className={inputClass} placeholder="IČO" value={recipient.ico}
              onChange={e => setRecipientField('ico')(e.target.value)} />
            <input className={inputClass} placeholder="E-mail" value={recipient.email}
              onChange={e => setRecipientField('email')(e.target.value)} />
            <input className={inputClass} placeholder="Telefon" value={recipient.phone}
              onChange={e => setRecipientField('phone')(e.target.value)} />
          </div>
        )}
      </div>

      {/* Items */}
      <div className="border border-white/8 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-white text-xs uppercase tracking-widest flex items-center gap-3">
            <span className="text-white/20">02</span>
            Položky
          </h2>
          <label className={checkboxLabel}>
            <input type="checkbox" checked={noItems} onChange={e => setNoItems(e.target.checked)} />
            Neuvádět položky vůbec
          </label>
        </div>

        {!noItems && (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="border border-white/10 p-3">
                <div className="grid grid-cols-[1fr_80px_70px_auto] gap-2 items-center mb-2">
                  <input className={inputClass} placeholder="Název položky" value={item.name}
                    onChange={e => updateItem(item.id, { name: e.target.value })} />
                  <input className={inputClass} type="number" placeholder="Množství" value={item.quantity}
                    onChange={e => updateItem(item.id, { quantity: e.target.value })} />
                  <input className={inputClass} placeholder="Jednotka" value={item.unit}
                    onChange={e => updateItem(item.id, { unit: e.target.value })} />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-white/40 hover:text-red-400 transition-colors text-lg leading-none px-2"
                    title="Odebrat položku"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <label className={checkboxLabel}>
                    <input type="checkbox" checked={item.showPrice}
                      onChange={e => updateItem(item.id, { showPrice: e.target.checked })} />
                    Zobrazit cenu v PDF
                  </label>
                  {item.showPrice && (
                    <input className={inputClass + ' max-w-[160px]'} type="number" placeholder="Cena / j. (Kč, bez DPH)"
                      value={item.unitPrice} onChange={e => updateItem(item.id, { unitPrice: e.target.value })} />
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => setItems(list => [...list, newItem()])}
              className="text-xs px-4 py-2 border border-white/15 text-white/60 hover:border-white/30 hover:text-white transition-colors duration-200"
            >
              + Přidat položku
            </button>

            {total > 0 && (
              <div className="flex justify-between items-center border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                <span className="text-white/40">Celkem (viditelné ceny)</span>
                <span className="text-white font-semibold">{total.toLocaleString('cs-CZ')} Kč</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="border border-white/8 p-6">
        <h2 className="font-black text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-3">
          <span className="text-white/20">03</span>
          Doplňující údaje (volitelné)
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass + ' col-span-2'} placeholder="Nadpis nabídky (výchozí: Cenová nabídka)"
            value={title} onChange={e => setTitle(e.target.value)} />
          <input className={inputClass} placeholder="Místo provedení"
            value={location} onChange={e => setLocation(e.target.value)} />
          <input className={inputClass} type="date" placeholder="Termín"
            value={serviceDate} onChange={e => setServiceDate(e.target.value)} />
          <textarea className={inputClass + ' col-span-2 resize-none'} rows={2} placeholder="Poznámky"
            value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      </div>

      {error && (
        <div className="border border-red-500/30 bg-red-500/8 text-red-400 px-5 py-3 text-sm">{error}</div>
      )}

      <button
        onClick={generate}
        disabled={generating}
        className="w-full bg-white text-black py-4 text-xs font-black tracking-widest uppercase hover:bg-white/90 disabled:bg-white/20 disabled:text-white/30 transition-colors duration-200"
      >
        {generating ? 'Generuji...' : 'Vygenerovat a otevřít PDF'}
      </button>
    </div>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';

const BUILDING_TYPES = [
  { value: 'office',      label: 'Kancelářský objekt' },
  { value: 'residential', label: 'Bytový dům' },
  { value: 'industrial',  label: 'Průmyslový objekt' },
  { value: 'commercial',  label: 'Obchodní centrum' },
  { value: 'hotel',       label: 'Hotel' },
  { value: 'other',       label: 'Jiný' },
];

type FormState = {
  name: string; email: string; phone: string;
  company: string; ico: string; billing_address: string;
  location: string; building_type: string; floors: string;
  facade_area: string; window_area: string;
  service_date: string; notes: string;
};

type Result = { order_num: string; total: number; pdf_url?: string };

function Field({
  label, id, type = 'text', value, onChange, placeholder, required, full, children,
}: {
  label: string; id: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  required?: boolean; full?: boolean; children?: React.ReactNode;
}) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label htmlFor={id} className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children || (
        <input
          id={id} type={type} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors duration-200"
        />
      )}
    </div>
  );
}

export default function OrderPage() {
  const [form, setForm] = useState<FormState>({
    name: '', email: '', phone: '', company: '', ico: '',
    billing_address: '', location: '', building_type: 'office',
    floors: '1', facade_area: '0', window_area: '0',
    service_date: '', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  const set = (k: keyof FormState) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const facade = parseFloat(form.facade_area) || 0;
  const windows = parseFloat(form.window_area) || 0;
  const totalArea = facade + windows;

  const today = new Date().toISOString().split('T')[0];

  const validate = () => {
    if (!form.name.trim()) return 'Vyplňte jméno';
    if (!form.email.includes('@')) return 'Neplatný e-mail';
    if (form.phone.length < 9) return 'Neplatné telefonní číslo';
    if (!form.billing_address.trim()) return 'Vyplňte fakturační adresu';
    if (!form.location.trim()) return 'Vyplňte místo provedení';
    if (totalArea <= 0) return 'Zadejte plochu fasády nebo oken';
    return '';
  };

  const submit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          floors: parseInt(form.floors) || 1,
          facade_area: facade,
          window_area: windows,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || 'Chyba serveru');
      }
      const data = await res.json();
      setResult(data);
      if (data.pdf_url) window.open(data.pdf_url, '_blank');
    } catch (e: any) {
      setError(e.message || 'Nepodařilo se odeslat objednávku');
    } finally {
      setLoading(false);
    }
  };

  const selectClass = "w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/40 transition-colors duration-200 appearance-none";

  if (result) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="border border-white/10 p-12 max-w-md w-full text-center">
          <div className="w-12 h-12 border border-white/20 flex items-center justify-center mx-auto mb-8">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <polyline points="3,10 8,15 17,5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">Objednávka přijata</h1>
          <p className="text-white/40 text-sm mb-8">Vaše zakázka byla úspěšně zaregistrována.</p>
          <div className="border border-white/10 bg-white/[0.04] p-6 mb-8">
            <div className="text-xs text-white/30 uppercase tracking-widest mb-2">Číslo objednávky</div>
            <div className="text-3xl font-black text-white">{result.order_num}</div>
          </div>
          <div className="space-y-3">
            <a
              href={result.pdf_url || `/api/orders/${result.order_num}/pdf`}
              target="_blank" rel="noopener"
              className="block w-full bg-white text-black py-4 text-xs font-black tracking-widest uppercase hover:bg-white/90 transition-colors duration-200"
            >
              Stáhnout cenovou nabídku
            </a>
            <Link href="/"
              className="block w-full border border-white/20 text-white/60 py-4 text-xs font-semibold tracking-widest uppercase hover:border-white/40 hover:text-white transition-colors duration-200">
              Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/8">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-white text-base tracking-[0.15em] uppercase">
            Sky Legends
          </Link>
          <span className="text-xs text-white/30 uppercase tracking-widest">Objednávka</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">Nová objednávka</h1>
          <p className="text-white/40 text-sm">Vyplňte formulář — cenová nabídka se vygeneruje automaticky po odeslání.</p>
        </div>

        <div className="space-y-2">
          {/* Contact */}
          <div className="border border-white/8 p-8">
            <h2 className="font-black text-white text-xs uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="text-white/20">01</span>
              Kontaktní údaje
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Jméno a příjmení" id="name" value={form.name} onChange={set('name')} placeholder="Jan Novák" required />
              <Field label="E-mail" id="email" type="email" value={form.email} onChange={set('email')} placeholder="jan@firma.cz" required />
              <Field label="Telefon" id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+420 777 123 456" required />
              <Field label="IČO" id="ico" value={form.ico} onChange={set('ico')} placeholder="12345678" />
              <Field label="Název společnosti" id="company" value={form.company} onChange={set('company')} placeholder="Firma s.r.o." />
              <div />
              <Field label="Fakturační adresa" id="billing" value={form.billing_address} onChange={set('billing_address')}
                placeholder="Ulice 1, 110 00 Praha 1" required full />
            </div>
          </div>

          {/* Service */}
          <div className="border border-white/8 p-8">
            <h2 className="font-black text-white text-xs uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="text-white/20">02</span>
              Místo a typ služby
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Adresa místa provedení" id="location" value={form.location} onChange={set('location')}
                placeholder="Ulice, číslo, město" required full />
              <Field label="Typ budovy" id="building_type" value={form.building_type} onChange={set('building_type')}>
                <select id="building_type" value={form.building_type} onChange={e => set('building_type')(e.target.value)}
                  className={selectClass}>
                  {BUILDING_TYPES.map(t => <option key={t.value} value={t.value} className="bg-black">{t.label}</option>)}
                </select>
              </Field>
              <Field label="Počet podlaží" id="floors" type="number" value={form.floors} onChange={set('floors')} placeholder="10" />
              <Field label="Preferovaný termín" id="date" type="date" value={form.service_date} onChange={set('service_date')}>
                <input type="date" id="date" value={form.service_date} min={today}
                  onChange={e => set('service_date')(e.target.value)}
                  className={selectClass + " [color-scheme:dark]"} />
              </Field>
            </div>
          </div>

          {/* Area + Calculator */}
          <div className="border border-white/8 p-8">
            <h2 className="font-black text-white text-xs uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="text-white/20">03</span>
              Plocha
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Field label="Plocha fasády (m²)" id="facade" type="number" value={form.facade_area}
                onChange={set('facade_area')} placeholder="0" required />
              <Field label="Plocha oken (m²)" id="windows" type="number" value={form.window_area}
                onChange={set('window_area')} placeholder="0" />
            </div>

            {totalArea > 0 && (
              <div className="border border-white/8 p-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Celková plocha</span>
                  <span className="text-white font-semibold">{totalArea} m²</span>
                </div>
                <p className="text-white/25 text-xs mt-3">Cena bude stanovena individuálně na základě rozsahu prací.</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="border border-white/8 p-8">
            <h2 className="font-black text-white text-xs uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="text-white/20">04</span>
              Poznámky (volitelné)
            </h2>
            <textarea
              value={form.notes} onChange={e => set('notes')(e.target.value)}
              placeholder="Speciální požadavky, omezení přístupu, typ povrchu..."
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors duration-200 resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="border border-red-500/30 bg-red-500/8 text-red-400 px-5 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={submit} disabled={loading}
            className="w-full bg-white text-black py-5 text-xs font-black tracking-widest uppercase hover:bg-white/90 disabled:bg-white/30 disabled:text-black/30 transition-colors duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Zpracování...
              </span>
            ) : 'Odeslat objednávku a stáhnout cenovou nabídku'}
          </button>

          <p className="text-xs text-white/20 text-center pt-2">
            Po odeslání se automaticky vygeneruje cenová nabídka. Vaše údaje jsou bezpečně uloženy.
          </p>
        </div>
      </div>
    </div>
  );
}

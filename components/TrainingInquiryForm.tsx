'use client';
import { useState } from 'react';
import Link from 'next/link';
import { track } from '../lib/analytics';

const TRAINING_TYPES = [
  { value: 'beginner', label: 'Jsem začátečník' },
  { value: 'a1_a3', label: 'Příprava A1/A3' },
  { value: 'a2', label: 'Příprava A2' },
  { value: 'practical', label: 'Praktické létání' },
  { value: 'company', label: 'Firemní školení' },
  { value: 'other', label: 'Jiné' },
];

const EXPERIENCE_LEVELS = [
  { value: 'never', label: 'Nikdy jsem nelétal/a' },
  { value: 'beginner', label: 'Začátečník' },
  { value: 'basic', label: 'Mám základní zkušenosti' },
  { value: 'advanced', label: 'Pokročilý pilot' },
  { value: 'company', label: 'Firemní provoz' },
];

type FormState = {
  name: string; company: string; email: string; phone: string;
  training_type: string;
  experience: string; notes: string; gdpr_consent: boolean;
};

const initialState: FormState = {
  name: '', company: '', email: '', phone: '',
  training_type: TRAINING_TYPES[0].value,
  experience: EXPERIENCE_LEVELS[0].value, notes: '', gdpr_consent: false,
};

const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors duration-200";
const selectClass = inputClass + " appearance-none";

export default function TrainingInquiryForm({ defaultTrainingType }: { defaultTrainingType?: string }) {
  const [form, setForm] = useState<FormState>(() => ({
    ...initialState,
    training_type: defaultTrainingType || initialState.training_type,
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);

  const markStarted = () => {
    if (!started) {
      setStarted(true);
      track('training_form_start');
    }
  };

  const set = (k: keyof FormState) => (v: string | boolean) => {
    markStarted();
    setForm(f => ({ ...f, [k]: v }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Vyplňte jméno a příjmení';
    if (!form.email.includes('@')) return 'Neplatný e-mail';
    if (form.phone.trim().length < 9) return 'Neplatné telefonní číslo';
    if (!form.gdpr_consent) return 'Pro odeslání poptávky je nutný souhlas se zpracováním osobních údajů';
    return '';
  };

  const submit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/training-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || 'Chyba serveru');
      }
      track('training_form_submit', { training_type: form.training_type });
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || 'Nepodařilo se odeslat poptávku');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="border border-white/10 bg-white/[0.03] p-10 lg:p-14 text-center">
        <div className="w-12 h-12 border border-white/20 flex items-center justify-center mx-auto mb-8">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <polyline points="3,10 8,15 17,5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight mb-3">Poptávka odeslána</h3>
        <p className="text-white/40 text-sm max-w-md mx-auto mb-8">
          Děkujeme za zájem o školení. Ozveme se vám co nejdříve s návrhem programu a termínu.
        </p>
        <Link href="/"
          className="inline-block border border-white/20 text-white/60 px-8 py-4 text-xs font-semibold tracking-widest uppercase hover:border-white/40 hover:text-white transition-colors duration-200">
          Zpět na hlavní stránku
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-white/10 p-8 lg:p-12">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
            Jméno a příjmení<span className="text-red-400 ml-1">*</span>
          </label>
          <input className={inputClass} value={form.name} onFocus={markStarted}
            onChange={e => set('name')(e.target.value)} placeholder="Jan Novák" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Firma</label>
          <input className={inputClass} value={form.company} onFocus={markStarted}
            onChange={e => set('company')(e.target.value)} placeholder="Firma s.r.o." />
        </div>
        <div>
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
            E-mail<span className="text-red-400 ml-1">*</span>
          </label>
          <input type="email" className={inputClass} value={form.email} onFocus={markStarted}
            onChange={e => set('email')(e.target.value)} placeholder="jan@firma.cz" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
            Telefon<span className="text-red-400 ml-1">*</span>
          </label>
          <input type="tel" className={inputClass} value={form.phone} onFocus={markStarted}
            onChange={e => set('phone')(e.target.value)} placeholder="+420 777 123 456" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Typ školení</label>
          <select className={selectClass} value={form.training_type} onFocus={markStarted}
            onChange={e => set('training_type')(e.target.value)}>
            {TRAINING_TYPES.map(t => <option key={t.value} value={t.value} className="bg-ink">{t.label}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Vaše zkušenosti</label>
          <select className={selectClass} value={form.experience} onFocus={markStarted}
            onChange={e => set('experience')(e.target.value)}>
            {EXPERIENCE_LEVELS.map(x => <option key={x.value} value={x.value} className="bg-ink">{x.label}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
            Poznámka / Co se chcete naučit?
          </label>
          <textarea rows={3} className={inputClass + " resize-none"} value={form.notes} onFocus={markStarted}
            onChange={e => set('notes')(e.target.value)} placeholder="Napište nám vaše zkušenosti a požadavky..." />
        </div>
      </div>

      <label className="flex items-start gap-3 mt-6 cursor-pointer select-none">
        <input type="checkbox" checked={form.gdpr_consent} onFocus={markStarted}
          onChange={e => set('gdpr_consent')(e.target.checked)}
          className="mt-1 w-4 h-4 accent-white shrink-0" />
        <span className="text-xs text-white/40 leading-relaxed">
          Souhlasím se zpracováním osobních údajů za účelem vyřízení poptávky na školení.
          <span className="text-red-400 ml-1">*</span>
        </span>
      </label>

      {error && (
        <div className="border border-red-500/30 bg-red-500/8 text-red-400 px-5 py-3 text-sm mt-6">
          {error}
        </div>
      )}

      <button
        onClick={submit} disabled={loading}
        className="w-full mt-8 bg-white text-ink py-5 text-xs font-black tracking-widest uppercase hover:bg-white/90 disabled:bg-white/30 disabled:text-ink/30 transition-colors duration-200"
      >
        {loading ? 'Odesílání...' : 'ODESLAT POPTÁVKU'}
      </button>
    </div>
  );
}

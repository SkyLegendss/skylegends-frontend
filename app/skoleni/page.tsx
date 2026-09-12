'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  Gamepad2, ShieldCheck, Route, Scale, Radar, CheckCircle2,
  PlaneTakeoff, Users, Building2, Award, MessageCircle, Check,
} from 'lucide-react';
import SiteNav from '../../components/SiteNav';
import SiteFooter from '../../components/SiteFooter';
import CornerFrame from '../../components/CornerFrame';
import TrainingInquiryForm from '../../components/TrainingInquiryForm';
import { trainings } from '../../lib/trainings';
import { track } from '../../lib/analytics';

function useFadeUp() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const WHAT_YOU_LEARN = [
  { icon: Gamepad2, title: 'OVLÁDÁNÍ DRONU', desc: 'Praktické létání, vzlet, přistání a přesné manévrování.' },
  { icon: ShieldCheck, title: 'BEZPEČNOST', desc: 'Příprava letu, kontrola okolí a řešení nestandardních situací.' },
  { icon: Route, title: 'PLÁNOVÁNÍ LETU', desc: 'Jak předem vyhodnotit místo, překážky a podmínky letu.' },
  { icon: Scale, title: 'LEGISLATIVA', desc: 'Základní orientace v kategoriích OPEN, A1/A3, A2 a SPECIFIC.' },
  { icon: Radar, title: 'LETOVÉ ZÓNY', desc: 'Jak kontrolovat, kde lze létat a jaká omezení na místě platí.' },
  { icon: CheckCircle2, title: 'REÁLNÁ PRAXE', desc: 'Nejen teorie — účastník si jednotlivé situace vyzkouší prakticky.' },
];

const PROCESS_STEPS = [
  { n: '01', title: 'POŠLETE POPTÁVKU', desc: 'Vyberete typ školení a napíšete nám své zkušenosti a požadavky.' },
  { n: '02', title: 'DOMLUVÍME PROGRAM', desc: 'Podle zkušeností, typu dronu a cíle školení připravíme vhodný obsah.' },
  { n: '03', title: 'TEORIE + PRAXE', desc: 'Projdeme bezpečnost, pravidla a následně praktický výcvik.' },
  { n: '04', title: 'SAMOSTATNÝ LET', desc: 'Účastník si pod dohledem instruktora vyzkouší kompletní přípravu a provedení letu.' },
];

const WHY_US = [
  { icon: PlaneTakeoff, title: 'PRAKTICKÉ ZKUŠENOSTI', desc: 'Školení vedou piloti s praktickou zkušeností z reálného provozu.' },
  { icon: CheckCircle2, title: 'TEORIE I PRAXE', desc: 'Pravidla nevysvětlujeme pouze na prezentaci. Účastníci si je vyzkouší při skutečném letu.' },
  { icon: Users, title: 'INDIVIDUÁLNÍ PŘÍSTUP', desc: 'Obsah přizpůsobíme zkušenostem pilota i používané technice.' },
  { icon: Building2, title: 'ŠKOLENÍ PRO FIRMY', desc: 'Program lze připravit také pro celý tým a konkrétní firemní provoz.' },
];

const FAQS = [
  { q: 'Je školení vhodné pro úplného začátečníka?', a: 'Ano. Praktický kurz může absolvovat i člověk, který s dronem ještě nikdy nelétal.' },
  { q: 'Potřebuji vlastní dron?', a: 'Dron není podmínkou — v rámci školení lze domluvit i létání s technikou Sky Legends. Konkrétní podmínky upřesníme podle typu školení.' },
  { q: 'Probíhá školení prakticky?', a: 'Ano. Součástí vybraných školení je praktický let s instruktorem.' },
  { q: 'Školíte také firmy?', a: 'Ano. Program lze přizpůsobit konkrétnímu provozu firmy, typu dronu a počtu zaměstnanců.' },
  { q: 'Pomůžete mi s přípravou na A1/A3 nebo A2?', a: 'Ano, lze nabídnout přípravu a vysvětlení požadavků platných pro daný typ provozu.' },
  { q: 'Kde školení probíhá?', a: 'Podle typu školení a domluvy — u nás, u vás ve firmě, nebo na vhodné lokalitě pro praktický let.' },
  { q: 'Kolik lidí může absolvovat firemní školení?', a: 'Podle dohody a charakteru praktické části.' },
  { q: 'Lze školení uspořádat přímo u nás ve firmě?', a: 'Ano, pokud místo umožňuje bezpečné provedení praktické části.' },
];

export default function SkoleniPage() {
  useFadeUp();

  useEffect(() => {
    track('training_page_view');
  }, []);

  return (
    <>
      <SiteNav />

      {/* ── HERO ── */}
      <section className="relative min-h-screen overflow-hidden bg-ink flex items-end">
        {/* Decorative backdrop — replace with real Sky Legends training photography when available */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(137,212,226,0.12),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(137,212,226,0.08),transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <img
            src="/drone-svgrepo-com.svg"
            alt=""
            className="absolute -right-20 top-1/4 w-[42rem] max-w-none opacity-[0.05] rotate-12 select-none pointer-events-none"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink" />
        <CornerFrame />

        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-12 pb-20 lg:pb-28 pt-32">
          <p className="text-white/40 text-xs font-medium uppercase tracking-[0.3em] mb-6">
            Česká republika · Školení pilotů dronů
          </p>
          <h1 className="text-[clamp(2.75rem,8vw,6.5rem)] font-black text-white leading-[1.05] tracking-tight mb-8">
            ŠKOLENÍ PILOTŮ <span className="text-accent">DRONŮ.</span>
          </h1>
          <p className="text-white/55 text-base lg:text-lg max-w-xl mb-10 leading-relaxed">
            Od prvního vzletu až po bezpečné využití dronů ve firmě. Praktické školení pro začátečníky,
            zaměstnance a firemní týmy.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#poptavka"
              onClick={() => track('training_beginner_cta_click')}
              className="bg-white text-ink px-8 py-4 text-xs font-black tracking-widest uppercase hover:bg-white/90 transition-colors duration-200">
              MÁM ZÁJEM O ŠKOLENÍ
            </a>
            <a href="#firmy"
              onClick={() => track('training_company_cta_click')}
              className="border border-white/30 text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:border-white transition-colors duration-200">
              ŠKOLENÍ PRO FIRMY
            </a>
          </div>
        </div>
      </section>

      {/* ── PRO KOHO JE ŠKOLENÍ ── */}
      <section id="pro-koho" className="py-32 bg-ink">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="mb-20 fade-up">
            <p className="text-white/25 text-xs font-semibold uppercase tracking-[0.25em] mb-4">Pro koho</p>
            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight">PRO KOHO JE ŠKOLENÍ</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-white/8">
            <div className="fade-up bg-ink p-10 lg:p-14">
              <div className="text-white/8 text-6xl font-black leading-none mb-8 select-none">01</div>
              <p className="text-white/25 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Začínající piloti</p>
              <h3 className="font-black text-white text-2xl lg:text-3xl mb-5 leading-snug">Začínáte s dronem?</h3>
              <p className="text-white/45 text-sm leading-relaxed mb-8 max-w-md">
                Školení pro každého, kdo chce získat jistotu při ovládání dronu, naučit se správně plánovat let
                a pochopit základní pravidla bezpečného provozu.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-10 text-white/35 text-sm">
                {[
                  'základní ovládání dronu', 'příprava před letem', 'vzlet a přistání',
                  'základní letové manévry', 'orientace v letovém prostoru', 'bezpečnost letu',
                  'nouzové situace', 'Return-to-Home a další bezpečnostní funkce',
                  'základní orientace v legislativě', 'praktické létání s instruktorem',
                ].map(item => (
                  <li key={item} className="flex gap-2 items-start">
                    <Check className="text-accent shrink-0 mt-0.5" size={14} strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#poptavka"
                onClick={() => track('training_beginner_cta_click')}
                className="inline-block bg-white text-ink px-8 py-4 text-xs font-black tracking-widest uppercase hover:bg-white/90 transition-colors duration-200">
                CHCI SE NAUČIT LÉTAT
              </a>
            </div>

            <div id="firmy" className="fade-up bg-ink p-10 lg:p-14">
              <div className="text-white/8 text-6xl font-black leading-none mb-8 select-none">02</div>
              <p className="text-white/25 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Firmy</p>
              <h3 className="font-black text-white text-2xl lg:text-3xl mb-5 leading-snug">Školení dronů pro firmy</h3>
              <p className="text-white/45 text-sm leading-relaxed mb-8 max-w-md">
                Praktické školení zaměstnanců a firemních týmů, které chtějí drony bezpečně začlenit do
                svého provozu.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-6 text-white/35 text-sm">
                {[
                  'bezpečný provoz dronů ve firmě', 'odpovědnost provozovatele a pilota',
                  'příprava a plánování letu', 'kontrola prostoru před letem',
                  'práce s geografickými zónami', 'interní provozní postupy',
                  'bezpečnost zaměstnanců a okolí', 'postup při nestandardních a nouzových situacích',
                  'praktický výcvik zaměstnanců', 'konzultace konkrétního využití dronu ve firmě',
                ].map(item => (
                  <li key={item} className="flex gap-2 items-start">
                    <Check className="text-accent shrink-0 mt-0.5" size={14} strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-white/30 text-xs leading-relaxed mb-8 max-w-md">
                Školení připravíme podle typu dronu, počtu zaměstnanců a konkrétního způsobu využití.
              </p>
              <a href="#poptavka"
                onClick={() => track('training_company_cta_click')}
                className="inline-block border border-white/30 text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:border-white hover:bg-white hover:text-ink transition-all duration-200">
                POPTAT FIREMNÍ ŠKOLENÍ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CO SE NAUČÍTE ── */}
      <section className="py-32 bg-ink border-t border-white/8">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="mb-20 fade-up">
            <p className="text-white/25 text-xs font-semibold uppercase tracking-[0.25em] mb-4">Obsah</p>
            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight">CO SE NAUČÍTE</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8">
            {WHAT_YOU_LEARN.map((item, i) => (
              <div key={item.title}
                className="fade-up bg-ink p-8 lg:p-10 hover:bg-white/3 transition-colors duration-300"
                style={{ transitionDelay: `${i * 60}ms` }}>
                <item.icon className="text-accent mb-6" size={28} strokeWidth={1.5} />
                <h3 className="font-bold text-white text-base mb-3 leading-snug">{item.title}</h3>
                <p className="text-sm text-white/38 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TYPY ŠKOLENÍ ── */}
      <section id="typy-skoleni" className="py-32 bg-ink">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="mb-20 fade-up">
            <p className="text-white/25 text-xs font-semibold uppercase tracking-[0.25em] mb-4">Nabídka</p>
            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight">TYPY ŠKOLENÍ</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-white/8">
            {trainings.filter(t => t.active).map((t, i) => (
              <div key={t.id}
                className="fade-up bg-ink p-8 lg:p-10 flex flex-col"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <h3 className="font-black text-white text-xl mb-3 leading-snug">{t.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-8">{t.shortDescription}</p>
                <div className="space-y-0 mb-8 border-y border-white/8">
                  {[
                    ['Úroveň', t.level],
                    ['Forma', t.format],
                    ['Délka', t.duration],
                    ['Místo', t.location],
                    ['Cena', t.price],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-3 border-b border-white/8 last:border-0 text-sm">
                      <span className="text-white/30">{label}</span>
                      <span className="text-white/70 font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
                <a href="#poptavka"
                  onClick={() => track(t.targetGroup.toLowerCase().includes('firm') ? 'training_company_cta_click' : 'training_beginner_cta_click', { training_id: t.id })}
                  className="mt-auto inline-block text-center bg-white text-ink px-6 py-4 text-xs font-black tracking-widest uppercase hover:bg-white/90 transition-colors duration-200">
                  {t.ctaLabel}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JAK ŠKOLENÍ PROBÍHÁ ── */}
      <section className="py-32 bg-ink border-t border-white/8">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="mb-20 fade-up">
            <p className="text-white/25 text-xs font-semibold uppercase tracking-[0.25em] mb-4">Postup</p>
            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight">JAK ŠKOLENÍ PROBÍHÁ</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8">
            {PROCESS_STEPS.map((s, i) => (
              <div key={s.n}
                className="fade-up bg-ink p-8 lg:p-10 hover:bg-white/3 transition-colors duration-300"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="text-white/8 text-7xl font-black leading-none mb-8 select-none">{s.n}</div>
                <h3 className="font-bold text-white text-base mb-3 leading-snug">{s.title}</h3>
                <p className="text-sm text-white/38 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROČ SKY LEGENDS ── */}
      <section className="py-32 bg-ink">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="mb-20 fade-up">
            <p className="text-white/25 text-xs font-semibold uppercase tracking-[0.25em] mb-4">Proč my</p>
            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight">PROČ SKY LEGENDS</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-px bg-white/8">
            {WHY_US.map((item, i) => (
              <div key={item.title}
                className="fade-up bg-ink p-8 lg:p-10 hover:bg-white/3 transition-colors duration-300"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <item.icon className="text-accent mb-6" size={28} strokeWidth={1.5} />
                <h3 className="font-bold text-white text-base mb-3 leading-snug">{item.title}</h3>
                <p className="text-sm text-white/38 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-32 bg-ink border-t border-white/8">
        <div className="max-w-4xl mx-auto px-8 lg:px-12">
          <div className="mb-20 fade-up">
            <p className="text-white/25 text-xs font-semibold uppercase tracking-[0.25em] mb-4">FAQ</p>
            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight">ČASTÉ DOTAZY</h2>
          </div>
          <div className="border-t border-white/10">
            {FAQS.map((faq, i) => (
              <details key={i}
                className="fade-up group border-b border-white/10 cursor-pointer"
                style={{ transitionDelay: `${i * 50}ms` }}>
                <summary className="flex justify-between items-center py-6 font-semibold text-white text-base hover:text-white/70 transition-colors duration-200 select-none">
                  {faq.q}
                  <span className="text-white/30 group-open:rotate-45 transition-transform duration-300 ml-6 shrink-0 text-2xl font-light leading-none">+</span>
                </summary>
                <p className="pb-6 text-white/40 text-sm leading-relaxed max-w-2xl">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── KONTAKTNÍ FORMULÁŘ ── */}
      <section id="poptavka" className="py-32 bg-ink border-t border-white/8">
        <div className="max-w-3xl mx-auto px-8 lg:px-12">
          <div className="mb-16 fade-up">
            <p className="text-white/25 text-xs font-semibold uppercase tracking-[0.25em] mb-4">Kontakt</p>
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-6">
              MÁTE ZÁJEM O ŠKOLENÍ?
            </h2>
            <p className="text-white/40 text-base leading-relaxed max-w-lg">
              Vyplňte formulář a my se vám ozveme s návrhem programu na míru.
            </p>
          </div>
          <div className="fade-up">
            <TrainingInquiryForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

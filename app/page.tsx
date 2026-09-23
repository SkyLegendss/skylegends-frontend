'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import CornerFrame from '../components/CornerFrame';

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

export default function Home() {
  useFadeUp();

  const steps = [
    { n: '01', title: 'Objednávka online', desc: 'Vyplňte formulář — jméno, adresa, plocha. Okamžitě získáte číslo zakázky a cenovou nabídku.' },
    { n: '02', title: 'Kalkulace ceny mytí', desc: 'Na základě plochy objektu vypočítáme cenu mytí a připravíme cenovou nabídku.' },
    { n: '03', title: 'Mytí fasády', desc: 'Drony s tlakovým systémem a profesionálními čisticími prostředky provádí mytí s vysokou přesností.' },
    { n: '04', title: 'Předání protokolu', desc: 'Po dokončení obdržíte fotodokumentaci a protokol o provedené práci.' },
  ];

  const faqs = [
    { q: 'Jak dlouho trvá mytí?', a: 'Záleží na ploše. Typicky 500 m² zvládneme za jeden pracovní den. Předběžný čas sdělíme při potvrzení objednávky.' },
    { q: 'Jaké povrchy drony zvládnou?', a: 'Sklo, hliník, beton, EIFS fasády, keramika. Před zahájením provedeme zkoušku kompatibility na vzorku.' },
    { q: 'Funguje to v zimě?', a: 'Provozní teplota dronů je +5 °C a výše. V zimních měsících doporučujeme konzultaci termínu.' },
    { q: 'Je potřeba speciální příprava?', a: 'Ne. Potřebujeme přístup k elektrické zásuvce (230 V),vzdušný prostor kolem budovy, připojení k vodovodu.' },
    { q: 'Kde působíte?', a: 'Operujeme po celé České republice. Sídlíme v Pardubicích a vyjíždíme na základě dohody.' },
  ];

  return (
    <>
      {/* ── NAV ── */}
      <SiteNav />

      {/* ── HERO ── */}
      <section className="relative h-screen overflow-hidden bg-ink">
        {/* Hero video — autoplay when file is present */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          style={{ display: 'block' }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/20 to-transparent" />
        <CornerFrame />

        {/* Content — positioned at bottom left like SpaceX */}
        <div className="absolute bottom-0 left-0 right-0 z-10 max-w-7xl mx-auto px-8 lg:px-12 pb-20 lg:pb-28">
          <p className="text-white/40 text-xs font-medium uppercase tracking-[0.3em] mb-6">
            Česká republika · Profesionální mytí fasád
          </p>
          <h1 className="text-[clamp(4rem,11vw,9rem)] font-black text-white leading-[1.05] tracking-tight mb-8">
            ČISTÁ<br /><span className="text-accent">FASÁDA.</span>
          </h1>
          <p className="text-white/55 text-base lg:text-lg max-w-md mb-10 leading-relaxed">
            Mytí fasád a oken výškových budov pomocí autonomních dronů.
            Bez lešení, za pevnou cenu.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/order"
              className="bg-white text-ink px-8 py-4 text-xs font-black tracking-widest uppercase hover:bg-white/90 transition-colors duration-200">
              OBJEDNAT MYTÍ
            </Link>
            <a href="#how"
              className="border border-white/30 text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:border-white transition-colors duration-200">
              JAK TO FUNGUJE
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-ink border-b border-white/10 py-14">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              ['60 m', 'Max. výška budovy'],
              ['48 h', 'od objednávky k mytí'],
              ['100%', 'profesionální čisticí prostředky'],
              ['Bez lešení', 'žádná stavební technika'],
            ].map(([val, label]) => (
              <div key={label} className="border-l border-white/10 pl-6">
                <div className="text-3xl lg:text-4xl font-black text-white mb-1">{val}</div>
                <div className="text-xs text-white/35 leading-relaxed">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-32 bg-ink">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="mb-20 fade-up">
            <p className="text-white/25 text-xs font-semibold uppercase tracking-[0.25em] mb-4">Postup</p>
            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight">JAK TO FUNGUJE</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8">
            {steps.map((s, i) => (
              <div
                key={i}
                className="fade-up bg-ink p-8 lg:p-10 hover:bg-white/3 transition-colors duration-300"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="text-white/8 text-7xl font-black leading-none mb-8 select-none">{s.n}</div>
                <h3 className="font-bold text-white text-base mb-3 leading-snug">{s.title}</h3>
                <p className="text-sm text-white/38 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* ── GALLERY ── */}
<section className="py-32 bg-ink border-t border-white/8">
  <div className="max-w-7xl mx-auto px-8 lg:px-12">

    <div className="mb-20 fade-up">
      <p className="text-white/25 text-xs font-semibold uppercase tracking-[0.25em] mb-4">
        Galerie
      </p>

      <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight">
        DRONY V AKCI
      </h2>
    </div>

    <div className="grid md:grid-cols-2 gap-2">
      {[
        {
  src: '/images/wash1.jpg',
  label: 'Mytí fasády',
  fit: 'contain',
  position: '50% 50%',
},
        { src: '/images/wash2.jpg', label: 'Čištění dlažby' },
      ].map((img, i) => (
        <div
          key={i}
          className="fade-up relative aspect-video bg-[#111] border border-white/5 overflow-hidden group"
          style={{ transitionDelay: `${i * 100}ms` }}
        >
          <img
            src={img.src}
            alt={img.label}
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />

          <div className="absolute bottom-4 left-6 text-white/40 text-xs uppercase tracking-widest">
            {img.label}
          </div>
        </div>
      ))}
    </div>

  </div>
</section>

      {/* ── ŠKOLENÍ PREVIEW ── */}
      <section className="py-20 bg-ink border-y border-white/8">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 fade-up">
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8 border border-white/10 p-10 lg:p-14">
            <CornerFrame inset={{ top: 16, right: 16, bottom: 16, left: 16 }} size={20} />
            <div>
              <p className="text-white text-xs font-black uppercase tracking-[0.25em] mb-4">Sky Legends</p>
              <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-4">
                ŠKOLENÍ PILOTŮ <span className="text-accent">DRONŮ</span>
              </h2>
              <p className="text-white/40 text-sm lg:text-base max-w-xl leading-relaxed">
                Chcete začít létat, zlepšit své schopnosti nebo vyškolit firemní tým? Nabízíme praktické školení
                pilotů dronů pro začátečníky i firmy.
              </p>
            </div>
            <Link href="/skoleni"
              className="shrink-0 inline-block border border-white/30 text-white px-8 py-4 text-xs font-black tracking-widest uppercase hover:border-white hover:bg-white hover:text-ink transition-all duration-200 whitespace-nowrap">
              Více o školení →
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-32 bg-ink">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="mb-20 fade-up">
            <p className="text-white/25 text-xs font-semibold uppercase tracking-[0.25em] mb-4">Nabídka</p>
            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight">
              INDIVIDUÁLNÍ<br />PŘÍSTUP.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-white/8 fade-up">
            <div className="bg-ink p-10 lg:p-16">
              <p className="text-white/55 text-base leading-relaxed mb-4 max-w-sm">
                Cena závisí na rozsahu prací, typu budovy, dostupnosti a dalších faktorech.
              </p>
              <p className="text-white/35 text-sm leading-relaxed mb-10 max-w-sm">
                Vyplňte nezávazný dotazník a obdržíte cenovou nabídku na míru — rychle a bez závazků.
              </p>
              <Link href="/order"
                className="inline-block bg-white text-ink px-8 py-4 text-xs font-black tracking-widest uppercase hover:bg-white/90 transition-colors duration-200">
                ZÍSKAT NABÍDKU ZDARMA
              </Link>
            </div>
            <div className="bg-ink p-10 lg:p-16">
              <div className="space-y-0">
                {[
                  ['Doprava v ceně', 'Doprava je v ceně v rámci Pardubického kraje a Prahy. Výjezdy do ostatních krajů jsou možné po předchozí domluvě.'],
                  ['Profesionální čisticí prostředky', 'Šetrné k fasádám i životnímu prostředí'],
                  ['Fotodokumentace', 'Před a po mytí — plná dokumentace'],
                  ['Nabídka okamžitě', 'PDF nabídka ihned po odeslání dotazníku'],
                  ['Záruka kvality', 'Opakujeme bezplatně, pokud nejste spokojeni'],
                ].map(([title, desc], i) => (
                  <div key={i} className="flex gap-4 items-start py-5 border-b border-white/6 last:border-0">
                    <Check className="text-accent shrink-0 mt-0.5" size={16} strokeWidth={2.5} />
                    <div>
                      <div className="text-white text-sm font-semibold mb-0.5">{title}</div>
                      <div className="text-white/35 text-sm">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-32 bg-ink border-t border-white/8">
        <div className="max-w-4xl mx-auto px-8 lg:px-12">
          <div className="mb-20 fade-up">
            <p className="text-white/25 text-xs font-semibold uppercase tracking-[0.25em] mb-4">FAQ</p>
            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight">ČASTÉ DOTAZY</h2>
          </div>
          <div className="border-t border-white/10">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="fade-up group border-b border-white/10 cursor-pointer"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
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

      {/* ── CTA ── */}
      <section className="py-32 bg-ink border-t border-white/8">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 fade-up">
          <p className="text-white/25 text-xs font-semibold uppercase tracking-[0.25em] mb-6">Kontakt</p>
          <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight mb-8">
            PŘIPRAVENI ZAČÍT?
          </h2>
          <p className="text-white/40 text-base lg:text-lg mb-12 max-w-lg leading-relaxed">
            Vyplňte objednávku za 2 minuty a stáhněte cenovou nabídku okamžitě.
          </p>
          <Link href="/order"
            className="inline-block bg-white text-ink px-10 py-5 text-xs font-black tracking-widest uppercase hover:bg-white/90 transition-colors duration-200">
            OBJEDNAT MYTÍ FASÁDY
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <SiteFooter />
    </>
  );
}

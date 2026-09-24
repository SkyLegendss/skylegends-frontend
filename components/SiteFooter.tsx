import Link from 'next/link';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer id="contact" className="bg-ink border-t border-white/10 py-20">
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <div>
            <div className="font-black text-white text-base tracking-[0.15em] uppercase mb-4">Sky Legends</div>
            <div className="text-white/35 text-sm leading-relaxed max-w-xs">
              Profesionální mytí fasád a oken výškových budov pomocí autonomních dronů. Bez lešení, za pevnou cenu.
            </div>
            <div className="flex items-center gap-3 mt-6">
  <a
    href="https://www.facebook.com/profile.php?id=61592000136003&locale=ru_RU"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
    className="w-10 h-10 border border-white/15 flex items-center justify-center text-white/40 hover:bg-white hover:text-ink hover:border-white transition-all duration-200"
  >
    <Facebook size={17} strokeWidth={1.7} />
  </a>

  <a
    href="https://www.instagram.com/skylegends_eu/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="w-10 h-10 border border-white/15 flex items-center justify-center text-white/40 hover:bg-white hover:text-ink hover:border-white transition-all duration-200"
  >
    <Instagram size={17} strokeWidth={1.7} />
  </a>

  <a
    href="https://www.linkedin.com/company/sky-legends-eu/?viewAsMember=true"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    className="w-10 h-10 border border-white/15 flex items-center justify-center text-white/40 hover:bg-white hover:text-ink hover:border-white transition-all duration-200"
  >
    <Linkedin size={17} strokeWidth={1.7} />
  </a>
</div>
          </div>
          <div>
            <div className="text-white/25 text-xs uppercase tracking-[0.2em] mb-5">Kontakt</div>
            <div className="text-white/55 text-sm space-y-2 leading-relaxed">
              <div>info@skylegends.eu</div>
              <div>774 306 718</div>
              <div className="text-white/35">
                Jiráskova 2860, Zelené Předměstí<br />
                530 02 Pardubice
              </div>
            </div>
          </div>
          <div>
            <div className="text-white/25 text-xs uppercase tracking-[0.2em] mb-5">Společnost</div>
            <div className="text-white/35 text-sm space-y-1.5 leading-relaxed">
              <div className="text-white/55">SENTEMOV GROUP s.r.o.</div>
              <div>IČO: 23089768</div>
              <div>DIČ: CZ23089768</div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-xs text-white/20">© 2025 SENTEMOV GROUP s.r.o. Všechna práva vyhrazena.</div>
          <div className="flex gap-6 text-xs text-white/25">
            <Link href="/order" className="hover:text-white/60 transition-colors">Objednat</Link>
            <Link href="/skoleni" className="hover:text-white/60 transition-colors">Školení</Link>
            <a href="/#how" className="hover:text-white/60 transition-colors">Jak to funguje</a>
            <a href="/#faq" className="hover:text-white/60 transition-colors">FAQ</a>
          </div>
        </div>
        <p className="pt-6 text-xs text-white/35 leading-relaxed">
          Společnost s ručením omezeným SENTEMOV GROUP s.r.o., založena 20.3.2025, zapsána pod značkou C 54459/KSHK Krajským soudem v Hradci Králové.
        </p>
        <div className="pt-4 text-center">
          <span className="text-[10px] text-white select-none">created by pashaslesar</span>
        </div>
      </div>
    </footer>
  );
}

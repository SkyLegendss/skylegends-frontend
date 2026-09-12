'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SECTION_LINKS = [
  { label: 'Jak to funguje', hash: 'how' },
  { label: 'Nabídka', hash: 'pricing' },
  { label: 'FAQ', hash: 'faq' },
];

export default function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const sectionHref = (hash: string) => (isHome ? `#${hash}` : `/#${hash}`);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-12 h-16 bg-ink/70 backdrop-blur-md border-b border-white/5">
      <Link href="/" className="font-black text-white text-base tracking-[0.15em] uppercase select-none">
        Sky Legends
      </Link>
      <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
        {SECTION_LINKS.map(l => (
          <a key={l.hash} href={sectionHref(l.hash)} className="hover:text-white transition-colors duration-200">
            {l.label}
          </a>
        ))}
        <Link
          href="/skoleni"
          className={`hover:text-white transition-colors duration-200 ${pathname === '/skoleni' ? 'text-white' : ''}`}
        >
          Školení
        </Link>
        <Link href="/order"
          className="border border-white/30 hover:border-white hover:bg-white hover:text-ink text-white px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-200">
          Objednat mytí
        </Link>
      </div>
      <div className="md:hidden">
        <Link href="/order"
          className="border border-white/30 text-white px-4 py-2 text-xs font-bold tracking-widest uppercase">
          Objednat
        </Link>
      </div>
    </nav>
  );
}

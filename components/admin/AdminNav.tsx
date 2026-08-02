'use client';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/admin', label: 'Přehled' },
  { href: '/admin/database', label: 'Databáze' },
  { href: '/admin/calendar', label: 'Kalendář' },
  { href: '/admin/pdf', label: 'Generátor PDF' },
];

export default function AdminNav() {
  const pathname = usePathname();

  if (pathname === '/admin/login') return null;

  return (
    <div className="bg-[#141414] border-b border-white/10 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-black text-white text-sm tracking-[0.15em] uppercase shrink-0">
            Sky Legends
          </Link>
          <span className="text-white/15">|</span>
          <nav className="flex items-center gap-1">
            {TABS.map(tab => {
              const active = tab.href === '/admin' ? pathname === '/admin' : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-3 py-2 text-xs font-semibold uppercase tracking-widest transition-colors duration-200 ${
                    active ? 'text-white border-b-2 border-white' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex gap-2 items-center">
          <Link href="/order"
            className="text-xs px-4 py-2 bg-white text-black font-bold hover:bg-white/90 transition-colors duration-200">
            + Nová objednávka
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="text-xs px-4 py-2 border border-white/10 text-white/40 hover:border-red-500/30 hover:text-red-400 transition-colors duration-200"
          >
            Odhlásit
          </button>
        </div>
      </div>
    </div>
  );
}

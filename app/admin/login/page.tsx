'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) {
      setError('Nesprávný e-mail nebo heslo.');
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors duration-200";

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="font-black text-white text-base tracking-[0.15em] uppercase inline-block mb-3">
            Sky Legends
          </Link>
          <p className="text-white/30 text-xs uppercase tracking-widest">Administrace</p>
        </div>

        <form onSubmit={handleSubmit} className="border border-white/8 bg-white/[0.02] p-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">E-mail</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required autoFocus placeholder="admin@skylegends.eu"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Heslo</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          {error && (
            <div className="border border-red-500/30 bg-red-500/8 text-red-400 text-xs px-4 py-3">
              {error}
            </div>
          )}
          <button
            type="submit" disabled={loading}
            className="w-full bg-white text-ink py-3 text-xs font-black tracking-widest uppercase hover:bg-white/90 disabled:bg-white/30 disabled:text-ink/30 transition-colors duration-200"
          >
            {loading ? 'Přihlašování...' : 'Přihlásit se'}
          </button>
        </form>

        <p className="text-center text-xs text-white/20 mt-6">
          <Link href="/" className="hover:text-white/50 transition-colors">
            Zpět na web
          </Link>
        </p>
      </div>
    </div>
  );
}

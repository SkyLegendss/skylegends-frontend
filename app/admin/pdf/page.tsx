'use client';
import { useState } from 'react';
import OrderPdfGenerator from '@/components/admin/OrderPdfGenerator';
import CustomQuoteBuilder from '@/components/admin/CustomQuoteBuilder';

export default function PdfBuilderPage() {
  const [mode, setMode] = useState<'order' | 'custom'>('custom');

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Generátor PDF</h1>
        <p className="text-white/35 text-sm mt-1">Sestavení cenové nabídky ve stejném vizuálním formátu jako pro zákazníky.</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('custom')}
          className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-widest border transition-colors ${
            mode === 'custom' ? 'bg-white text-black border-white' : 'border-white/15 text-white/50 hover:border-white/30'
          }`}
        >
          Vlastní konstruktor
        </button>
        <button
          onClick={() => setMode('order')}
          className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-widest border transition-colors ${
            mode === 'order' ? 'bg-white text-black border-white' : 'border-white/15 text-white/50 hover:border-white/30'
          }`}
        >
          Podle objednávky
        </button>
      </div>

      {mode === 'custom' ? <CustomQuoteBuilder /> : <OrderPdfGenerator />}
    </div>
  );
}

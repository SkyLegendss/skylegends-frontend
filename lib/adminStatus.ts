export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:         { label: 'Nová',      color: 'border border-white/15 text-white/50' },
  confirmed:   { label: 'Potvrzena', color: 'border border-blue-400/30 text-blue-400' },
  in_progress: { label: 'Probíhá',   color: 'border border-amber-400/30 text-amber-400' },
  completed:   { label: 'Dokončena', color: 'border border-green-400/30 text-green-400' },
  cancelled:   { label: 'Zrušena',   color: 'border border-red-400/30 text-red-400' },
};

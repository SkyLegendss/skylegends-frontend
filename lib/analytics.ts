declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export type TrainingEvent =
  | 'training_page_view'
  | 'training_beginner_cta_click'
  | 'training_company_cta_click'
  | 'training_form_start'
  | 'training_form_submit';

export function track(event: TrainingEvent, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

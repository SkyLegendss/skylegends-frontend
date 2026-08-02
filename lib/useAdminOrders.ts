'use client';
import useSWR from 'swr';
import { fetcher, ADMIN_CACHE_MS } from './fetcher';

export type Order = {
  id: string; order_num: string; created_at: string;
  location: string; facade_area: number; window_area: number;
  total_area: number; total_price: number; status: string;
  pdf_url?: string; notes?: string; service_date?: string;
  clients?: { name: string; email: string; phone: string; company?: string };
};

export type Stats = {
  total_orders: number; total_clients: number;
  total_area: number; total_revenue: number;
  by_status: Record<string, number>;
};

// Shared across every admin page: same SWR key ('/api/admin/orders') means
// navigating between /admin, /admin/database, /admin/calendar and /admin/pdf
// reuses the already-loaded data instead of refetching, for up to
// ADMIN_CACHE_MS. Call `mutate()` after a write (status change, delete) to
// refresh immediately regardless of that window.
export function useAdminOrders() {
  const { data, error, isLoading, mutate } = useSWR<{ orders: { data: Order[] }; stats: Stats }>(
    '/api/admin/orders',
    fetcher,
    {
      dedupingInterval: ADMIN_CACHE_MS,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    orders: data?.orders?.data || [],
    stats: data?.stats || null,
    isLoading,
    error,
    mutate,
  };
}

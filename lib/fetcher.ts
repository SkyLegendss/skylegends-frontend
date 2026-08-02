export async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const err: any = new Error('Request failed');
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// Cached admin data is reused across page navigations for this long before
// a background revalidation is triggered again.
export const ADMIN_CACHE_MS = 10 * 60 * 1000;

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchBrands(category) {
  const res = await fetch(`${API_URL}/brands?category=${category}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchProducts({ page = 1, category = '', brand = '', search = '' } = {}) {
  const res = await fetch(`${API_URL}/products?page=${page}&category=${category}&brand=${brand}&search=${search}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

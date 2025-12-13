export async function fetchCategories() {
  const res = await fetch('/categories', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

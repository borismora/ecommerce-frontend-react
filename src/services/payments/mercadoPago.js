export async function createPreference(items) {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${apiUrl}/create-preference`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    throw new Error('Failed to create preference');
  }

  const data = await response.json();
  return data.id;
}

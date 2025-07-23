export async function createPreference(items) {
  const response = await fetch('http://localhost:4000/create_preference', {
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

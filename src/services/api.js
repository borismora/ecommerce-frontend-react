const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw error;
  }

  return response.json();
}

export const api = {
  get: (path) => request(path),

  post: (path, body) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body)
    }),

  put: (path, body) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(body)
    }),

  delete: (path) =>
    request(path, {
      method: "DELETE"
    })
};

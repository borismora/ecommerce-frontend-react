import api from '../lib/api';

export async function submitOrder({ user, items, total }) {
  return api.post('/posts', { user, items, total });
}

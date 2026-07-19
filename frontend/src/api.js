const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers }, ...options,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || 'Something went wrong. Please try again.')
  }
  return response.status === 204 ? null : response.json()
}

export const usersApi = {
  list: () => request('/users'),
  create: (user) => request('/users', { method: 'POST', body: JSON.stringify(user) }),
  update: (id, user) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),
  remove: (id) => request(`/users/${id}`, { method: 'DELETE' }),
}

const API_URL =
  import.meta.env.VITE_API_URL || "https://user-crud-app-y7ms.onrender.com";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || "Something went wrong.");
  }

  return response.status === 204 ? null : response.json();
}

export const usersApi = {
  list: () => request("/api/users"),
  create: (user) =>
    request("/api/users", {
      method: "POST",
      body: JSON.stringify(user),
    }),
  update: (id, user) =>
    request(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    }),
  remove: (id) =>
    request(`/api/users/${id}`, {
      method: "DELETE",
    }),
};
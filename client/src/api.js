const API_BASE = import.meta.env.VITE_API_BASE || "";

async function request(path, options = {}) {
  const token = localStorage.getItem("litian_token");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "请求失败");
  return data;
}

export const api = {
  site: () => request("/api/public/site"),
  page: (slug) => request(`/api/public/pages/${slug}`),
  login: (payload) => request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  appointment: (payload) => request("/api/appointments", { method: "POST", body: JSON.stringify(payload) }),
  adminPages: () => request("/api/admin/pages"),
  updatePage: (slug, payload) => request(`/api/admin/pages/${slug}`, { method: "PUT", body: JSON.stringify(payload) }),
  adminCases: () => request("/api/admin/cases"),
  createCase: (payload) => request("/api/admin/cases", { method: "POST", body: JSON.stringify(payload) }),
  updateCase: (id, payload) => request(`/api/admin/cases/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteCase: (id) => request(`/api/admin/cases/${id}`, { method: "DELETE" }),
  adminNotices: () => request("/api/admin/notices"),
  createNotice: (payload) => request("/api/admin/notices", { method: "POST", body: JSON.stringify(payload) }),
  table: (name) => request(`/api/admin/${name}`),
  createTable: (name, payload) => request(`/api/admin/${name}`, { method: "POST", body: JSON.stringify(payload) })
};

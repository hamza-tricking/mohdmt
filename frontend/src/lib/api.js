import { getToken } from "./auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const ORIGIN = API.replace(/\/api\/?$/, "");

export const fileUrl = (path) => (!path ? "" : /^https?:/.test(path) ? path : `${ORIGIN}${path}`);

async function request(path, { method = "GET", body, auth = false, form } = {}) {
  const headers = {};
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: form || (body ? JSON.stringify(body) : undefined),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "حدث خطأ، حاول مرة أخرى");
    err.status = res.status;
    throw err;
  }
  return data;
}

// عام
export const getProducts = () => request("/products");
export const getSettings = () => request("/settings");
export const getDeliveryRates = () => request("/delivery-rates");
export const createOrder = (payload) => request("/orders", { method: "POST", body: payload });

// المدير
export const login = (email, password) =>
  request("/auth/login", { method: "POST", body: { email, password } });
export const getMe = () => request("/auth/me", { auth: true });
export const getAdminProducts = () => request("/admin/products", { auth: true });
export const updateProduct = (id, body) =>
  request(`/admin/products/${id}`, { method: "PUT", body, auth: true });
export const getAdminOrders = () => request("/admin/orders", { auth: true });
export const updateOrderStatus = (id, status) =>
  request(`/admin/orders/${id}`, { method: "PATCH", body: { status }, auth: true });
export const saveSettings = (body) => request("/admin/settings", { method: "PUT", body, auth: true });
export const saveDeliveryRates = (rates) =>
  request("/admin/delivery-rates", { method: "PUT", body: { rates }, auth: true });
export const uploadFile = (file) => {
  const form = new FormData();
  form.append("file", file);
  return request("/upload", { method: "POST", form, auth: true });
};

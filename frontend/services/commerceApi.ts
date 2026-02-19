import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("ws-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const commerceApi = {
  // Auth
  register: (data: any) => axios.post(`${API_BASE}/auth/register`, data),
  login: (data: any) => axios.post(`${API_BASE}/auth/login`, data),

  // Products
  getProducts: (params: any) => axios.get(`${API_BASE}/products`, { params }),
  getProductById: (id: string) => axios.get(`${API_BASE}/products/${id}`),

  // Cart
  getCart: () => axios.get(`${API_BASE}/cart`, { headers: getHeaders() }),
  addToCart: (productId: string, quantity: number) =>
    axios.post(
      `${API_BASE}/cart`,
      { productId, quantity },
      { headers: getHeaders() },
    ),
  removeFromCart: (productId: string) =>
    axios.delete(`${API_BASE}/cart/${productId}`, { headers: getHeaders() }),

  // Wishlist
  getWishlist: () =>
    axios.get(`${API_BASE}/wishlist`, { headers: getHeaders() }),
  addToWishlist: (productId: string) =>
    axios.post(
      `${API_BASE}/wishlist`,
      { productId },
      { headers: getHeaders() },
    ),
  removeFromWishlist: (productId: string) =>
    axios.delete(`${API_BASE}/wishlist/${productId}`, {
      headers: getHeaders(),
    }),

  // Orders
  getOrders: () => axios.get(`${API_BASE}/orders`, { headers: getHeaders() }),
  createOrder: (data: any) =>
    axios.post(`${API_BASE}/orders`, data, { headers: getHeaders() }),
  getOrderById: (id: string) =>
    axios.get(`${API_BASE}/orders/${id}`, { headers: getHeaders() }),

  // Reviews
  getReviews: (productId: string) =>
    axios.get(`${API_BASE}/reviews/${productId}`),
  postReview: (data: any) =>
    axios.post(`${API_BASE}/reviews`, data, { headers: getHeaders() }),

  // Addresses
  getAddresses: () =>
    axios.get(`${API_BASE}/addresses`, { headers: getHeaders() }),
  addAddress: (data: any) =>
    axios.post(`${API_BASE}/addresses`, data, { headers: getHeaders() }),
  deleteAddress: (id: string) =>
    axios.delete(`${API_BASE}/addresses/${id}`, { headers: getHeaders() }),
};

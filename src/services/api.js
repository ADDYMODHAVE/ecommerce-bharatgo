import axios from "axios";
const api = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  loginUser: (credentials) => api.post("/auth/login", credentials),
};

// Product API calls
export const productAPI = {
  getAllProducts: (params = {}) => api.get("/products"),
  getProductById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get("/categories"),
};
// User API calls
export const userAPI = {
  getProfile: () => api.get("/auth/profile"),
};

export default api;

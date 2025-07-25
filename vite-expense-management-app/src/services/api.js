import axios from "axios";

console.log("Backend Running on : ", import.meta.env.VITE_BACKEND_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }

    let csrfToken = localStorage.getItem("CSRF_TOKEN");
    if (!csrfToken) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/csrf`, {
          withCredentials: true,
        });
        csrfToken = response.data.token;
        localStorage.setItem("CSRF_TOKEN", csrfToken);
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    }

    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }

    console.log("X-XSRF-TOKEN:", csrfToken);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

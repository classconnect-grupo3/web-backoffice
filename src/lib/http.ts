import axios from "axios"

export const apiClient = axios.create({
  baseURL: "https://class-connect-main-6b7ca6f.d2.zuplo.dev",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("id_token")
    if (token) {
      config.headers = config.headers? config.headers : {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("id_token")
      localStorage.removeItem("is_admin")

      // Redirect to login page
      window.location.href = "/signin"
    }
    return Promise.reject(error)
  },
)

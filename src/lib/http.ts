import axios from "axios"

export const apiClient = axios.create({
  baseURL: "https://class-connect-main-6b7ca6f.d2.zuplo.dev",
  headers: {
    "Content-Type": "application/json",
  },
});


// Initialize token on app start
const initializeToken = () => {
  const token = localStorage.getItem("id_token")
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`
    console.log("Token initialized from localStorage")
  }
}

// Initialize token immediately
initializeToken()

// Request interceptor to add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("id_token")
    if (token && !config.headers?.["Authorization"]) {
      if (config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
    }
    console.log("Request interceptor - Token added:", !!token)
    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("Response interceptor error:", error)

    if (error.response?.status === 401) {
      console.log("401 error - clearing auth and redirecting to signin")
      // Clear auth data
      localStorage.removeItem("id_token")
      localStorage.removeItem("is_admin")
      delete apiClient.defaults.headers.common["Authorization"]

      // Redirect to signin
      window.location.href = "/signin"
    }

    return Promise.reject(error)
  },
)

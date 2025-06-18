import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://class-connect-main-6b7ca6f.d2.zuplo.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

if (typeof window !== "undefined") {
  const token = localStorage.getItem("id_token");
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

export default apiClient;
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://class-connect-main-6b7ca6f.d2.zuplo.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

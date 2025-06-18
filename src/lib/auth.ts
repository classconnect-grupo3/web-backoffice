import { apiClient } from "./http"

export interface User {
  uid: string
  name: string
  surname: string
  email: string
  is_admin: boolean
  latitude?: number | null
  longitude?: number | null
}

export class AuthService {
  static getToken(): string | null {
    return localStorage.getItem("id_token")
  }

  static isAdmin(): boolean {
    return localStorage.getItem("is_admin") === "true"
  }

  static isAuthenticated(): boolean {
    const token = this.getToken()
    const isAdmin = this.isAdmin()
    console.log("AuthService.isAuthenticated:", { token: !!token, isAdmin })
    return !!token && isAdmin
  }

  static logout(): void {
    console.log("AuthService.logout called")
    localStorage.removeItem("id_token")
    localStorage.removeItem("is_admin")
    delete apiClient.defaults.headers.common["Authorization"]
    window.location.href = "/signin"
  }

  static initializeAuth(): void {
    const token = this.getToken()
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`
      console.log("AuthService.initializeAuth: Token set in headers")
    } else {
      console.log("AuthService.initializeAuth: No token found")
    }
  }
}

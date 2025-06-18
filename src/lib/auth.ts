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
    return !!token
  }

  static logout(): void {
    localStorage.removeItem("id_token")
    localStorage.removeItem("is_admin")
    delete apiClient.defaults.headers.common["Authorization"]
    window.location.href = "/signin"
  }

  static initializeAuth(): void {
    const token = this.getToken()
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
  }

  static async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken()
      if (!token) return false

      // You can add a token validation endpoint here if available
      // For now, we'll assume the token is valid if it exists
      return true
    } catch (error) {
      console.error("Token validation failed:", error)
      this.logout()
      return false
    }
  }
}

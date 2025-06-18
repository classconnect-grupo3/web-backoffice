"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiClient } from "../../lib/http"

interface LoginResponse {
  id_token: string
  user_info: {
    uid: string
    name: string
    surname: string
    is_admin: boolean
    latitude?: number | null
    longitude?: number | null
  }
}

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data } = await apiClient.post<LoginResponse>("/login/email", { email, password })
      const token = data.id_token
      const user_info = data.user_info

      console.log("Login data: ", data)

      // Save token and user info first
      localStorage.setItem("id_token", token)
      localStorage.setItem("is_admin", user_info.is_admin.toString())

      // Set the authorization header for future requests
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`

      console.log("API response:", data)

      const { is_admin } = user_info

      if (!is_admin) {
        navigate("/unauthorized")
        return
      }

      // Redirect to the dashboard or home of backoffice
      navigate("/")
    } catch (err: any) {
      console.error("Login error:", err)

      if (err.response) {
        console.error("Response data:", err.response.data)
        console.error("Response status:", err.response.status)

        // Handle specific error cases
        if (err.response.status === 401) {
          setError("Invalid email or password")
        } else if (err.response.status === 403) {
          setError("Access denied. Admin privileges required.")
        } else {
          setError(`Server error: ${err.response.status}`)
        }
      } else if (err.request) {
        console.error("No response received:", err.request)
        setError("No response from server. Please check your connection.")
      } else {
        console.error("Error during setup:", err.message)
        setError("Unexpected error occurred.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-6">Sign In to Backoffice</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your password"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  )
}

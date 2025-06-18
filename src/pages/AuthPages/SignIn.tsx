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
      console.log("Attempting login with:", { email })

      const { data } = await apiClient.post<LoginResponse>("/login/email", { email, password })
      const token = data.id_token
      const user_info = data.user_info

      console.log("Login successful:", { token: !!token, user_info })

      // Save token and user info
      localStorage.setItem("id_token", token)
      localStorage.setItem("is_admin", user_info.is_admin.toString())

      // Set the authorization header for future requests
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`

      console.log("Token and admin status saved:", {
        tokenSaved: !!localStorage.getItem("id_token"),
        isAdmin: localStorage.getItem("is_admin"),
      })

      // Check if user is admin
      if (!user_info.is_admin) {
        console.log("User is not admin, redirecting to unauthorized")
        navigate("/unauthorized")
        return
      }

      // Redirect to dashboard
      console.log("Admin user, redirecting to dashboard")
      navigate("/")
    } catch (err: any) {
      console.error("Login error:", err)

      if (err.response) {
        console.error("Response data:", err.response.data)
        console.error("Response status:", err.response.status)

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to Backoffice</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Admin access required</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

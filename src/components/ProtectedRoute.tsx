"use client"

import { type JSX, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { AuthService } from "../lib/auth"

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // Initialize auth headers
        AuthService.initializeAuth()

        const token = AuthService.getToken()
        const isAdmin = AuthService.isAdmin()

        if (!token) {
          setIsValid(false)
          setIsValidating(false)
          return
        }

        if (!isAdmin) {
          setIsValid(false)
          setIsValidating(false)
          return
        }

        // Validate token
        const tokenValid = await AuthService.validateToken()
        setIsValid(tokenValid)
      } catch (error) {
        console.error("Auth validation error:", error)
        setIsValid(false)
      } finally {
        setIsValidating(false)
      }
    }

    validateAuth()
  }, [])

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const token = AuthService.getToken()
  const isAdmin = AuthService.isAdmin()

  if (!token) return <Navigate to="/signin" replace />
  if (!isAdmin) return <Navigate to="/unauthorized" replace />
  if (!isValid) return <Navigate to="/signin" replace />

  return children
}

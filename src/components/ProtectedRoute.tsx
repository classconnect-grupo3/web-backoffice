import type { JSX } from "react"
import { Navigate } from "react-router-dom"

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("id_token")
  const isAdmin = localStorage.getItem("is_admin") === "true"

  console.log("ProtectedRoute - Token:", !!token, "IsAdmin:", isAdmin)

  // If no token, redirect to signin
  if (!token) {
    console.log("No token found, redirecting to signin")
    return <Navigate to="/signin" replace />
  }

  // If not admin, redirect to unauthorized
  if (!isAdmin) {
    console.log("User is not admin, redirecting to unauthorized")
    return <Navigate to="/unauthorized" replace />
  }

  // User is authenticated and is admin, render the protected content
  console.log("User is authenticated admin, rendering protected content")
  return children 
}

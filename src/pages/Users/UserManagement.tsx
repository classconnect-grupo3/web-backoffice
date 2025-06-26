"use client"

import React from "react"
import { useState, useEffect } from "react"
import { apiClient } from "../../lib/http"
import { AuthService } from "../../lib/auth"

interface User {
  uid: string
  name: string
  surname: string
  email: string
  phone: string
  latitude: number
  longitude: number
  is_active: boolean
  is_blocked: boolean
  is_admin: boolean
}

interface SearchResponse {
  data: User[]
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [query, setQuery] = useState("")

  // Filters
  const [showAdminsOnly, setShowAdminsOnly] = useState(false)
  const [showBlockedOnly, setShowBlockedOnly] = useState(false)
  const [showActiveOnly, setShowActiveOnly] = useState(false)

  // Modal states
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showUnblockModal, setShowUnblockModal] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const searchUsers = async () => {
    if (!query.trim()) {
      setError("Please enter a search query")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await apiClient.get<SearchResponse>("/users/search", {
        params: { query: query.trim() },
      })

      let filteredUsers = response.data.data

      // Apply filters
      if (showAdminsOnly) {
        filteredUsers = filteredUsers.filter((user) => user.is_admin)
      }
      if (showBlockedOnly) {
        filteredUsers = filteredUsers.filter((user) => user.is_blocked)
      }
      if (showActiveOnly) {
        filteredUsers = filteredUsers.filter((user) => user.is_active)
      }

      setUsers(filteredUsers)

      if (filteredUsers.length === 0) {
        setError("No users found matching your criteria")
      }
    } catch (err: any) {
      console.error("Search error:", err)
      if (err.response?.status === 401) {
        AuthService.logout()
      } else {
        setError("Failed to search users. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBlockUser = async () => {
    if (!selectedUser) return

    setActionLoading(true)
    try {
      await apiClient.post("/users/block", {
        email: selectedUser.email,
      })

      setSuccess(`User ${selectedUser.name} ${selectedUser.surname} has been blocked successfully`)
      setShowBlockModal(false)
      setSelectedUser(null)

      // Refresh the search results
      setTimeout(() => {
        searchUsers()
      }, 1000)
    } catch (err: any) {
      console.error("Block user error:", err)
      if (err.response?.status === 401) {
        AuthService.logout()
      } else {
        setError("Failed to block user. Please try again.")
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleUnblockUser = async () => {
    if (!selectedUser) return

    setActionLoading(true)
    try {
      await apiClient.post("/users/unlock", {
        email: selectedUser.email,
      })

      setSuccess(`User ${selectedUser.name} ${selectedUser.surname} has been unblocked successfully`)
      setShowUnblockModal(false)
      setSelectedUser(null)

      // Refresh the search results
      setTimeout(() => {
        searchUsers()
      }, 1000)
    } catch (err: any) {
      console.error("Unblock user error:", err)
      if (err.response?.status === 401) {
        AuthService.logout()
      } else {
        setError("Failed to unblock user. Please try again.")
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleMakeAdmin = async () => {
    if (!selectedUser) return

    setActionLoading(true)
    try {
      await apiClient.post("/users/admin", {
        email: selectedUser.email,
      })

      setSuccess(`User ${selectedUser.name} ${selectedUser.surname} has been made an admin successfully`)
      setShowAdminModal(false)
      setSelectedUser(null)

      // Refresh the search results
      setTimeout(() => {
        searchUsers()
      }, 1000)
    } catch (err: any) {
      console.error("Make admin error:", err)
      if (err.response?.status === 401) {
        AuthService.logout()
      } else {
        setError("Failed to make user admin. Please try again.")
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchUsers()
    }
  }

  const refreshData = () => {
    if (query.trim()) {
      searchUsers()
    }
  }

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("")
        setSuccess("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Search and manage campus users</p>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={searchUsers}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Searching..." : "Search"}
            </button>
            <button
              onClick={refreshData}
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showAdminsOnly}
              onChange={(e) => setShowAdminsOnly(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Admins Only</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showBlockedOnly}
              onChange={(e) => setShowBlockedOnly(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Blocked Only</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Active Only</span>
          </label>
        </div>
      </div>

      {/* Messages */}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>
      )}

      {/* Results Table */}
      {users.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name} {user.surname}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {user.is_admin && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            Admin
                          </span>
                        )}
                        {user.is_blocked && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Blocked
                          </span>
                        )}
                        {user.is_active && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {user.is_blocked ? (
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowUnblockModal(true)
                            }}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowBlockModal(true)
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Block
                          </button>
                        )}
                        {!user.is_admin && (
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowAdminModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Make Admin
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Block User Modal */}
      {showBlockModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Block User</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to block{" "}
              <strong>
                {selectedUser.name} {selectedUser.surname}
              </strong>
              ? This action is not reversible and the user will lose access to the platform.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowBlockModal(false)
                  setSelectedUser(null)
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockUser}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? "Blocking..." : "Block User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unblock User Modal */}
      {showUnblockModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Unblock User</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to unblock{" "}
              <strong>
                {selectedUser.name} {selectedUser.surname}
              </strong>
              ? This will restore their access to the platform.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowUnblockModal(false)
                  setSelectedUser(null)
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUnblockUser}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading ? "Unblocking..." : "Unblock User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Make Admin Modal */}
      {showAdminModal &&
        selectedUser &&
        (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Make Admin</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to make{" "}
              <strong>
                {selectedUser.name} {selectedUser.surname}
              </strong>{" "}
              an admin? This action is not reversible and will grant them full administrative privileges.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAdminModal(false)
                  setSelectedUser(null)
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMakeAdmin}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Make Admin"}
              </button>
            </div>
          </div>
        </div>
        )}
    </div>
  )
}

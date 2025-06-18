"use client"

import { useState } from "react"
import PageMeta from "../../components/common/PageMeta"
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import Button from "../../components/ui/button/Button"
import Input from "../../components/form/input/InputField"
import { Modal } from "../../components/ui/modal"
import { Search, RefreshCw, Shield, Ban, AlertTriangle } from "lucide-react"
import { apiClient } from "../../lib/http"

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

interface FilterOptions {
  adminsOnly: boolean
  blockedOnly: boolean
  activeOnly: boolean
}

export default function UserManagement() {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    adminsOnly: false,
    blockedOnly: false,
    activeOnly: false,
  })

  // Modal states
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

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
      if (filters.adminsOnly) {
        filteredUsers = filteredUsers.filter((user) => user.is_admin)
      }
      if (filters.blockedOnly) {
        filteredUsers = filteredUsers.filter((user) => user.is_blocked)
      }
      if (filters.activeOnly) {
        filteredUsers = filteredUsers.filter((user) => user.is_active)
      }

      setUsers(filteredUsers)
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.message || "Failed to search users. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    if (query.trim()) {
      searchUsers()
    }
  }

  const handleBlockUser = async () => {
    if (!selectedUser) return

    setLoading(true)
    setError("")

    try {
      const response = await apiClient.post("/users/block", {
        email: selectedUser.email,
      })

      if (response.status === 200 || response.status === 201) {
        setSuccess(`User ${selectedUser.name} ${selectedUser.surname} has been blocked successfully`)
        setShowBlockModal(false)
        setSelectedUser(null)
        refreshData()
      }
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.message || "Failed to block user. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleMakeAdmin = async () => {
    if (!selectedUser) return

    setLoading(true)
    setError("")

    try {
      const response = await apiClient.post("/users/admin", {
        email: selectedUser.email,
      })

      if (response.status === 200 || response.status === 201) {
        setSuccess(`User ${selectedUser.name} ${selectedUser.surname} has been made an admin successfully`)
        setShowAdminModal(false)
        setSelectedUser(null)
        refreshData()
      }
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.message || "Failed to make user admin. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const openBlockModal = (user: User) => {
    setSelectedUser(user)
    setShowBlockModal(true)
  }

  const openAdminModal = (user: User) => {
    setSelectedUser(user)
    setShowAdminModal(true)
  }

  return (
    <div>
      <PageMeta title="User Management" description="Search and manage campus users" />
      <PageBreadcrumb pageTitle="User Management" />

      <div className="space-y-6">
        {/* Search Section */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div onKeyDown={(e) => e.key === "Enter" && searchUsers()}>
                  <Input
                    type="text"
                    placeholder="Search users by name, email, or phone..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={searchUsers} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Search"}
              </Button>
              <Button variant="outline" onClick={refreshData} disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.adminsOnly}
                  onChange={(e) => setFilters((prev) => ({ ...prev, adminsOnly: e.target.checked }))}
                  className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Admins only</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.blockedOnly}
                  onChange={(e) => setFilters((prev) => ({ ...prev, blockedOnly: e.target.checked }))}
                  className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Blocked only</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.activeOnly}
                  onChange={(e) => setFilters((prev) => ({ ...prev, activeOnly: e.target.checked }))}
                  className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Active only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Shield className="h-5 w-5" />
              {success}
            </div>
          </div>
        )}

        {/* Results Table */}
        {users.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-gray-800">
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
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2">
                          {!user.is_admin && (
                            <Button size="sm" variant="outline" onClick={() => openAdminModal(user)} disabled={loading}>
                              <Shield className="h-4 w-4 mr-1" />
                              Make Admin
                            </Button>
                          )}
                          {!user.is_blocked && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openBlockModal(user)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Block
                            </Button>
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

        {users.length === 0 && query && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">No users found matching your search criteria.</div>
          </div>
        )}
      </div>

      {/* Block User Modal */}
      <Modal isOpen={showBlockModal} onClose={() => setShowBlockModal(false)} className="max-w-md mx-auto mt-20 p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <Ban className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Block User</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Are you sure you want to block{" "}
            <span className="font-medium">
              {selectedUser?.name} {selectedUser?.surname}
            </span>
            ? This action cannot be reversed.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setShowBlockModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleBlockUser} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
              {loading ? "Blocking..." : "Block User"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Make Admin Modal */}
      <Modal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} className="max-w-md mx-auto mt-20 p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Make Admin</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Are you sure you want to make{" "}
            <span className="font-medium">
              {selectedUser?.name} {selectedUser?.surname}
            </span>{" "}
            an administrator? This action cannot be reversed.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setShowAdminModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleMakeAdmin} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? "Processing..." : "Make Admin"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

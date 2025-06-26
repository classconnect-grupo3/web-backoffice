"use client"

import { useState, useEffect } from "react"
import PageMeta from "../../components/common/PageMeta"
import PageBreadCrumb from "../../components/common/PageBreadCrumb"
import { apiClient } from "../../lib/http"

interface UserStatsData {
  total_users: number
  active_users: number
  inactive_users: number
  blocked_users: number
  admin_users: number
  users_with_phone: number
  users_without_phone: number
  users_with_location: number
  users_without_location: number
}

interface StatsResponse {
  data: UserStatsData
}

interface StatCard {
  title: string
  value: number
  icon: string
  color: string
  bgColor: string
  percentage?: number
  total?: number
}

export default function Statistics() {
  const [stats, setStats] = useState<UserStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await apiClient.get<StatsResponse>("/users/admin/stats")
      setStats(response.data.data)
      setLastUpdated(new Date())
    } catch (err: any) {
      console.error("Stats fetch error:", err)
      setError("Failed to load statistics. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const getStatCards = (stats: StatsData): StatCard[] => [
    {
      title: "Total Users",
      value: stats.total_users,
      icon: "👥",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Active Users",
      value: stats.active_users,
      icon: "✅",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      percentage: stats.total_users > 0 ? (stats.active_users / stats.total_users) * 100 : 0,
      total: stats.total_users,
    },
    {
      title: "Inactive Users",
      value: stats.inactive_users,
      icon: "😴",
      color: "text-gray-600",
      bgColor: "bg-gray-100 dark:bg-gray-900/20",
      percentage: stats.total_users > 0 ? (stats.inactive_users / stats.total_users) * 100 : 0,
      total: stats.total_users,
    },
    {
      title: "Admin Users",
      value: stats.admin_users,
      icon: "🛡️",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      percentage: stats.total_users > 0 ? (stats.admin_users / stats.total_users) * 100 : 0,
      total: stats.total_users,
    },
    {
      title: "Blocked Users",
      value: stats.blocked_users,
      icon: "🚫",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      percentage: stats.total_users > 0 ? (stats.blocked_users / stats.total_users) * 100 : 0,
      total: stats.total_users,
    },
    {
      title: "Users with Phone",
      value: stats.users_with_phone,
      icon: "📱",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
      percentage: stats.total_users > 0 ? (stats.users_with_phone / stats.total_users) * 100 : 0,
      total: stats.total_users,
    },
    {
      title: "Users without Phone",
      value: stats.users_without_phone,
      icon: "📵",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      percentage: stats.total_users > 0 ? (stats.users_without_phone / stats.total_users) * 100 : 0,
      total: stats.total_users,
    },
    {
      title: "Users with Location",
      value: stats.users_with_location,
      icon: "📍",
      color: "text-teal-600",
      bgColor: "bg-teal-100 dark:bg-teal-900/20",
      percentage: stats.total_users > 0 ? (stats.users_with_location / stats.total_users) * 100 : 0,
      total: stats.total_users,
    },
    {
      title: "Users without Location",
      value: stats.users_without_location,
      icon: "📍",
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      percentage: stats.total_users > 0 ? (stats.users_without_location / stats.total_users) * 100 : 0,
      total: stats.total_users,
    },
  ]

  if (loading) {
    return (
      <div>
        <PageMeta title="App Statistics" description="View app users statistics" />
        <PageBreadCrumb pageTitle="Statistics" />
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Loading statistics...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <PageMeta title="App Statistics" description="View app users statistics" />
        <PageBreadCrumb pageTitle="Statistics" />
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-medium">Error Loading Statistics</h3>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={fetchStats}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const statCards = getStatCards(stats)

  return (
    <div>
      <PageMeta title="App Statistics" description="View campus app usage statistics" />
      <PageBreadCrumb pageTitle="Statistics" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">App Statistics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of your campus app usage and user metrics</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <span className="text-2xl">{card.icon}</span>
              </div>
              {card.percentage !== undefined && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{card.percentage.toFixed(1)}%</div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{card.title}</h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{card.value.toLocaleString()}</div>

              {card.percentage !== undefined && card.total && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      card.color.includes("green")
                        ? "bg-green-500"
                        : card.color.includes("blue")
                          ? "bg-blue-500"
                          : card.color.includes("red")
                            ? "bg-red-500"
                            : card.color.includes("purple")
                              ? "bg-purple-500"
                              : card.color.includes("indigo")
                                ? "bg-indigo-500"
                                : card.color.includes("orange")
                                  ? "bg-orange-500"
                                  : card.color.includes("teal")
                                    ? "bg-teal-500"
                                    : card.color.includes("pink")
                                      ? "bg-pink-500"
                                      : "bg-gray-500"
                    }`}
                    style={{ width: `${card.percentage}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Activity Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Activity</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Active Users</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${stats.total_users > 0 ? (stats.active_users / stats.total_users) * 100 : 0}%` }}
                  />
                </div>
                <span className="font-medium text-gray-900 dark:text-white w-12 text-right">{stats.active_users}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Inactive Users</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 bg-gray-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${stats.total_users > 0 ? (stats.inactive_users / stats.total_users) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="font-medium text-gray-900 dark:text-white w-12 text-right">
                  {stats.inactive_users}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Blocked Users</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 bg-red-500 rounded-full transition-all duration-300"
                    style={{ width: `${stats.total_users > 0 ? (stats.blocked_users / stats.total_users) * 100 : 0}%` }}
                  />
                </div>
                <span className="font-medium text-gray-900 dark:text-white w-12 text-right">{stats.blocked_users}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Completeness */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <span className="text-xl">📈</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Completeness</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Phone Numbers</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 bg-indigo-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${stats.total_users > 0 ? (stats.users_with_phone / stats.total_users) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="font-medium text-gray-900 dark:text-white w-12 text-right">
                  {stats.users_with_phone}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Location Data</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 bg-teal-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${stats.total_users > 0 ? (stats.users_with_location / stats.total_users) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="font-medium text-gray-900 dark:text-white w-12 text-right">
                  {stats.users_with_location}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Admin Privileges</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 bg-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${stats.total_users > 0 ? (stats.admin_users / stats.total_users) * 100 : 0}%` }}
                  />
                </div>
                <span className="font-medium text-gray-900 dark:text-white w-12 text-right">{stats.admin_users}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {stats.total_users > 0 ? ((stats.active_users / stats.total_users) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">User Engagement Rate</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {stats.total_users > 0 ? ((stats.users_with_phone / stats.total_users) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Profile Completion (Phone)</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-teal-600 mb-1">
              {stats.total_users > 0 ? ((stats.users_with_location / stats.total_users) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Location Sharing Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

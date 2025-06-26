"use client"

import React from "react"
import { useState, useEffect } from "react"
import { apiClient } from "../../lib/http"
import PageMeta from "../../components/common/PageMeta"
import PageBreadCrumb from "../../components/common/PageBreadCrumb"

interface AssignmentStats {
  total_assignments: number
  assignments_by_type: {
    exam: number
    homework: number
    quiz: number
  }
  assignments_by_status: {
    draft: number
    published: number
  }
  assignment_distribution: Array<{
    type: string
    status: string
    count: number
  }>
}

const AssignmentStatistics: React.FC = () => {
  const [stats, setStats] = useState<AssignmentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get<AssignmentStats>("/backoffice/statistics/assignments")
      setStats(response.data)
      setLastUpdated(new Date())
    } catch (err) {
      setError("Failed to fetch assignment statistics")
      console.error("Error fetching assignment stats:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "exam":
        return "📝"
      case "homework":
        return "📚"
      case "quiz":
        return "❓"
      default:
        return "📄"
    }
  }

  const StatCard = ({
    title,
    value,
    total,
    icon,
    color = "blue",
  }: {
    title: string
    value: number
    total?: number
    icon: string
    color?: string
  }) => {
    const percentage = total ? calculatePercentage(value, total) : 0

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
          </div>
          <div className="text-3xl">{icon}</div>
        </div>
        {total && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Percentage</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className={`h-2 rounded-full bg-${color}-500`} style={{ width: `${percentage}%` }}></div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <PageMeta title="Assignment Statistics" description="View assignments statistics"/>
        <PageBreadCrumb pageTitle="Assignment Statistics" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <PageMeta title="Assignment Statistics" description="View assignments statistics"/>
        <PageBreadCrumb pageTitle="Assignment Statistics" />
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="p-6">
      <PageMeta title="Assignment Statistics" description="View assignments statistics"/>

      <div className="flex justify-between items-center mb-6">
        <PageBreadCrumb pageTitle="Assignment Statistics" />
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchStats}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Assignments" value={stats.total_assignments} icon="📋" color="blue" />
        <StatCard
          title="Exams"
          value={stats.assignments_by_type.exam}
          total={stats.total_assignments}
          icon="📝"
          color="red"
        />
        <StatCard
          title="Homework"
          value={stats.assignments_by_type.homework}
          total={stats.total_assignments}
          icon="📚"
          color="green"
        />
        <StatCard
          title="Quizzes"
          value={stats.assignments_by_type.quiz}
          total={stats.total_assignments}
          icon="❓"
          color="purple"
        />
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assignment Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Published</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{stats.assignments_by_status.published}</span>
                <span className="text-sm text-green-600 dark:text-green-400">
                  ({calculatePercentage(stats.assignments_by_status.published, stats.total_assignments)}%)
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Draft</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{stats.assignments_by_status.draft}</span>
                <span className="text-sm text-yellow-600 dark:text-yellow-400">
                  ({calculatePercentage(stats.assignments_by_status.draft, stats.total_assignments)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Type Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">📝 Exams</span>
                <span className="font-medium">
                  {calculatePercentage(stats.assignments_by_type.exam, stats.total_assignments)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{ width: `${calculatePercentage(stats.assignments_by_type.exam, stats.total_assignments)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">📚 Homework</span>
                <span className="font-medium">
                  {calculatePercentage(stats.assignments_by_type.homework, stats.total_assignments)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{
                    width: `${calculatePercentage(stats.assignments_by_type.homework, stats.total_assignments)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">❓ Quizzes</span>
                <span className="font-medium">
                  {calculatePercentage(stats.assignments_by_type.quiz, stats.total_assignments)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-purple-500"
                  style={{ width: `${calculatePercentage(stats.assignments_by_type.quiz, stats.total_assignments)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Distribution Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Assignment Distribution</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {stats.assignment_distribution.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(item.type)}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {calculatePercentage(item.count, stats.total_assignments)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Assignment Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total_assignments}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Assignments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {calculatePercentage(stats.assignments_by_type.exam, stats.total_assignments)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Exams</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {calculatePercentage(stats.assignments_by_status.published, stats.total_assignments)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {calculatePercentage(stats.assignments_by_type.quiz, stats.total_assignments)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Quizzes</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignmentStatistics

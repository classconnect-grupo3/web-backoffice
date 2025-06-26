"use client"

import React from "react"
import { useState, useEffect } from "react"
import { apiClient } from "../../lib/http"
import PageMeta from "../../components/common/PageMeta"
import PageBreadCrumb from "../../components/common/PageBreadCrumb"

interface CourseStats {
  total_courses: number
  courses_by_status: {
    active: number
    finished: number
  }
}

const CourseStatistics: React.FC = () => {
  const [stats, setStats] = useState<CourseStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get<CourseStats>("/backoffice/statistics/courses")
      setStats(response.data)
      setLastUpdated(new Date())
    } catch (err) {
      setError("Failed to fetch course statistics")
      console.error("Error fetching course stats:", err)
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
        <PageMeta title="Course Statistics" description="View course statistics"/>
        <PageBreadCrumb pageTitle="Course Statistics" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <PageMeta title="Course Statistics" description="View course statistics"/>
        <PageBreadCrumb pageTitle="Course Statistics" />
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

  const activePercentage = calculatePercentage(stats.courses_by_status.active, stats.total_courses)
  const finishedPercentage = calculatePercentage(stats.courses_by_status.finished, stats.total_courses)

  return (
    <div className="p-6">
      <PageMeta title="Course Statistics" description="View course statistics"/>

      <div className="flex justify-between items-center mb-6">
        <PageBreadCrumb pageTitle="Course Statistics" />
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Courses" value={stats.total_courses} icon="📚" color="blue" />
        <StatCard
          title="Active Courses"
          value={stats.courses_by_status.active}
          total={stats.total_courses}
          icon="🟢"
          color="green"
        />
        <StatCard
          title="Finished Courses"
          value={stats.courses_by_status.finished}
          total={stats.total_courses}
          icon="✅"
          color="gray"
        />
      </div>

      {/* Course Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Status Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Active Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{stats.courses_by_status.active}</span>
                <span className="text-sm text-green-600 dark:text-green-400">({activePercentage}%)</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Finished Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{stats.courses_by_status.finished}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">({finishedPercentage}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">Active</span>
                <span className="font-medium">{activePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="h-3 rounded-full bg-green-500" style={{ width: `${activePercentage}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">Finished</span>
                <span className="font-medium">{finishedPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="h-3 rounded-full bg-gray-500" style={{ width: `${finishedPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Course Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total_courses}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Courses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activePercentage}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Currently Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{finishedPercentage}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseStatistics

"use client"

import React from "react"
import { useState, useEffect } from "react"
import { apiClient } from "../../lib/http"
import PageMeta from "../../components/common/PageMeta"
import PageBreadCrumb from "../../components/common/PageBreadCrumb"

interface GeneralStats {
  total_courses: number
  total_assignments: number
  total_submissions: number
  total_enrollments: number
  total_forum_questions: number
  total_forum_answers: number
  active_courses: number
  finished_courses: number
  total_exams: number
  total_homeworks: number
  total_quizzes: number
  draft_submissions: number
  submitted_submissions: number
  late_submissions: number
  active_enrollments: number
  dropped_enrollments: number
  completed_enrollments: number
  open_forum_questions: number
  resolved_forum_questions: number
  closed_forum_questions: number
  total_unique_teachers: number
  total_unique_aux_teachers: number
  total_unique_students: number
  average_students_per_course: number
  average_assignments_per_course: number
  average_submissions_per_assignment: number
  courses_created_this_month: number
  assignments_created_this_month: number
  submissions_this_month: number
  enrollments_this_month: number
}

const GeneralStatistics: React.FC = () => {
  const [stats, setStats] = useState<GeneralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get<GeneralStats>("/backoffice/statistics/general")
      setStats(response.data)
      setLastUpdated(new Date())
    } catch (err) {
      setError("Failed to fetch general statistics")
      console.error("Error fetching general stats:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const StatCard = ({
    title,
    value,
    icon,
    subtitle,
  }: {
    title: string
    value: number | string
    icon: string
    color?: string
    subtitle?: string
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-6">
        <PageMeta title="General Statistics" description="View general app statistics"/>
        <PageBreadCrumb pageTitle ="General Statistics" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <PageMeta title="General Statistics" description="View general app statistics"/>
        <PageBreadCrumb pageTitle ="General Statistics" />
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
      <PageMeta title="General Statistics" description="View general app statistics"/>

      <div className="flex justify-between items-center mb-6">
        <PageBreadCrumb pageTitle ="General Statistics" />
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

      {/* Platform Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📊 Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Courses" value={stats.total_courses} icon="📚" />
          <StatCard title="Total Assignments" value={stats.total_assignments} icon="📋" />
          <StatCard title="Total Submissions" value={stats.total_submissions} icon="📝" />
          <StatCard title="Total Enrollments" value={stats.total_enrollments} icon="🎓" />
        </div>
      </div>

      {/* Course Analytics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📚 Course Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Active Courses" value={stats.active_courses} icon="🟢" color="green" />
          <StatCard title="Finished Courses" value={stats.finished_courses} icon="✅" color="gray" />
          <StatCard title="Created This Month" value={stats.courses_created_this_month} icon="🆕" color="blue" />
        </div>
      </div>

      {/* Assignment Breakdown */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📋 Assignment Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Exams" value={stats.total_exams} icon="📝" color="red" />
          <StatCard title="Homework" value={stats.total_homeworks} icon="📚" color="green" />
          <StatCard title="Quizzes" value={stats.total_quizzes} icon="❓" color="purple" />
          <StatCard title="Created This Month" value={stats.assignments_created_this_month} icon="🆕" color="blue" />
        </div>
      </div>

      {/* Submission Analytics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📤 Submission Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Draft Submissions" value={stats.draft_submissions} icon="📄" color="yellow" />
          <StatCard title="Submitted" value={stats.submitted_submissions} icon="✅" color="green" />
          <StatCard title="Late Submissions" value={stats.late_submissions} icon="⏰" color="red" />
          <StatCard title="This Month" value={stats.submissions_this_month} icon="📈" color="blue" />
        </div>
      </div>

      {/* Enrollment Status */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">🎓 Enrollment Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Active Enrollments" value={stats.active_enrollments} icon="🟢" color="green" />
          <StatCard title="Completed" value={stats.completed_enrollments} icon="🎉" color="blue" />
          <StatCard title="Dropped" value={stats.dropped_enrollments} icon="❌" color="red" />
          <StatCard title="This Month" value={stats.enrollments_this_month} icon="📈" color="blue" />
        </div>
      </div>

      {/* Forum Activity */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">💬 Forum Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Questions" value={stats.total_forum_questions} icon="❓" />
          <StatCard title="Total Answers" value={stats.total_forum_answers} icon="💬" />
          <StatCard title="Open Questions" value={stats.open_forum_questions} icon="🔓" color="yellow" />
          <StatCard title="Resolved" value={stats.resolved_forum_questions} icon="✅" color="green" />
        </div>
      </div>

      {/* User Roles */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">👥 User Roles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Teachers" value={stats.total_unique_teachers} icon="👨‍🏫" color="blue" />
          <StatCard title="Assistant Teachers" value={stats.total_unique_aux_teachers} icon="👩‍🏫" color="green" />
          <StatCard title="Students" value={stats.total_unique_students} icon="🎓" color="purple" />
        </div>
      </div>

      {/* Platform Averages */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📊 Platform Averages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Students per Course"
            value={stats.average_students_per_course.toFixed(2)}
            icon="👥"
            color="blue"
            subtitle="Average enrollment"
          />
          <StatCard
            title="Assignments per Course"
            value={stats.average_assignments_per_course.toFixed(2)}
            icon="📋"
            color="green"
            subtitle="Average workload"
          />
          <StatCard
            title="Submissions per Assignment"
            value={stats.average_submissions_per_assignment.toFixed(2)}
            icon="📝"
            color="purple"
            subtitle="Completion rate"
          />
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎯 Key Platform Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {Math.round((stats.active_courses / stats.total_courses) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Courses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round((stats.submitted_submissions / stats.total_submissions) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Submission Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round((stats.resolved_forum_questions / stats.total_forum_questions) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Forum Resolution</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round((stats.completed_enrollments / stats.total_enrollments) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Course Completion</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneralStatistics

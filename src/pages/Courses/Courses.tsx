"use client"

import React from "react"
import { useState, useEffect } from "react"
import PageMeta from "../../components/common/PageMeta"
import PageBreadCrumb from "../../components/common/PageBreadCrumb"
import { apiClient } from "../../lib/http"

interface Course {
  id: string
  title: string
  description: string
  teacher_uuid: string
  teacher_name: string
  capacity: number
  students_amount: number
  modules: any[]
  aux_teachers: any[]
  start_date: string
  end_date: string
  feedback: any[]
  created_at: string
  updated_at: string
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchAllCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<Course[]>("/courses")
      setCourses(response.data || [])
      setLastUpdated(new Date())
    } catch (err: any) {
      console.error("Error fetching courses:", err)
      setError(err.response?.data?.message || "Failed to fetch courses")
    } finally {
      setLoading(false)
    }
  }

  const searchCourses = async (title: string) => {
    if (!title.trim()) {
      fetchAllCourses()
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<Course[]>(`/courses/title/${encodeURIComponent(title)}`)
      setCourses(response.data || [])
      setLastUpdated(new Date())
    } catch (err: any) {
      console.error("Error searching courses:", err)
      setError(err.response?.data?.message || "Failed to search courses")
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllCourses()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchCourses(searchQuery)
  }

  const handleRefresh = () => {
    if (searchQuery.trim()) {
      searchCourses(searchQuery)
    } else {
      fetchAllCourses()
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z") {
      return "Not set"
    }
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z") {
      return "Not set"
    }
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCapacityStatus = (studentsAmount: number, capacity: number) => {
    if (capacity === 0) return { percentage: 0, color: "bg-gray-200", textColor: "text-gray-600" }

    const percentage = (studentsAmount / capacity) * 100

    if (percentage >= 90) return { percentage, color: "bg-red-500", textColor: "text-red-600" }
    if (percentage >= 70) return { percentage, color: "bg-yellow-500", textColor: "text-yellow-600" }
    return { percentage, color: "bg-green-500", textColor: "text-green-600" }
  }

  return (
    <div className="p-6">
      <PageMeta title="Course Management" description="View courses"/>
      <PageBreadCrumb pageTitle="Course Management" />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Course Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                View and search through all courses in the platform
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search courses by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
            >
              {loading ? "Searching..." : "Search"}
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  fetchAllCourses()
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Results Info */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {loading ? (
                "Loading courses..."
              ) : error ? (
                <span className="text-red-600 dark:text-red-400">Error: {error}</span>
              ) : (
                <>
                  Showing {courses.length} course{courses.length !== 1 ? "s" : ""}
                  {searchQuery && ` matching "${searchQuery}"`}
                </>
              )}
            </p>
            {lastUpdated && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 dark:text-red-400 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-lg font-medium">Failed to load courses</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{error}</p>
              </div>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-lg font-medium text-gray-900 dark:text-white">No courses found</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {searchQuery ? `No courses match "${searchQuery}"` : "No courses available"}
                </p>
              </div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Course Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Enrollment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dates
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {courses.map((course) => {
                  const capacityStatus = getCapacityStatus(course.students_amount, course.capacity)

                  return (
                    <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {course.title || "Untitled Course"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {course.description ? (
                              <span className="line-clamp-2">{course.description}</span>
                            ) : (
                              <span className="italic">No description</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">ID: {course.id.slice(-8)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {course.teacher_name || course.teacher_uuid || "Not assigned"}
                        </div>
                        {course.aux_teachers && course.aux_teachers.length > 0 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            +{course.aux_teachers.length} assistant{course.aux_teachers.length !== 1 ? "s" : ""}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {course.students_amount}/{course.capacity || "∞"}
                              </span>
                              <span className={`text-xs font-medium ${capacityStatus.textColor}`}>
                                {course.capacity > 0 ? `${Math.round(capacityStatus.percentage)}%` : "No limit"}
                              </span>
                            </div>
                            {course.capacity > 0 && (
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${capacityStatus.color}`}
                                  style={{ width: `${Math.min(capacityStatus.percentage, 100)}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div>Start: {formatDate(course.start_date)}</div>
                          <div className="text-gray-500 dark:text-gray-400">End: {formatDate(course.end_date)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <div>Created: {formatDateTime(course.created_at)}</div>
                          <div>Updated: {formatDateTime(course.updated_at)}</div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Courses

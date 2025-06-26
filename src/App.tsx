import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SignIn from "./pages/AuthPages/SignIn"
import NotFound from "./pages/OtherPage/NotFound"
import AppLayout from "./layout/AppLayout"
import { ScrollToTop } from "./components/common/ScrollToTop"
import TestPage from "./pages/TestPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import Unauthorized from "./pages/OtherPage/Unauthorized"
import UserManagement from "./pages/Users/UserManagement"
import Statistics from "./pages/Dashboard/Statistics"
import { ErrorBoundary } from "./components/ErrorBoundary.tsx"

// Lazy load template pages to catch import errors
import { lazy, Suspense } from "react"

const Home = lazy(() => import("./pages/Dashboard/Home"))
const UserProfiles = lazy(() => import("./pages/UserProfiles"))
const Calendar = lazy(() => import("./pages/Calendar"))
const Blank = lazy(() => import("./pages/Blank"))
const AuthorizeAdmin = lazy(() => import("./pages/Users/AuthorizeAdmin"))
const BlockUser = lazy(() => import("./pages/Users/BlockUser"))

// UI Elements
const Videos = lazy(() => import("./pages/UiElements/Videos"))
const Images = lazy(() => import("./pages/UiElements/Images"))
const Alerts = lazy(() => import("./pages/UiElements/Alerts"))
const Badges = lazy(() => import("./pages/UiElements/Badges"))
const Avatars = lazy(() => import("./pages/UiElements/Avatars"))
const Buttons = lazy(() => import("./pages/UiElements/Buttons"))

// Charts
const LineChart = lazy(() => import("./pages/Charts/LineChart"))
const BarChart = lazy(() => import("./pages/Charts/BarChart"))

// Forms and Tables
const FormElements = lazy(() => import("./pages/Forms/FormElements"))
const BasicTables = lazy(() => import("./pages/Tables/BasicTables"))

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">
                      Error loading Home page.{" "}
                      <a href="/test" className="text-blue-600 underline">
                        Try Test Page
                      </a>
                    </h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <Home />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route path="test" element={<TestPage />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="user-management" element={<UserManagement />} />

          <Route
            path="authorize-admin"
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">Error loading Authorize Admin page</h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <AuthorizeAdmin />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route
            path="block-user"
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">Error loading Block User page</h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <BlockUser />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route
            path="profile"
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">Error loading User Profile page</h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <UserProfiles />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route
            path="calendar"
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">Error loading Calendar page</h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <Calendar />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route
            path="blank"
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">Error loading Blank page</h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <Blank />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route
            path="form-elements"
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">Error loading Form Elements page</h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <FormElements />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route
            path="basic-tables"
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">Error loading Basic Tables page</h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <BasicTables />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route
            path="alerts"
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">Error loading Alerts page</h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <Alerts />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route
            path="avatars"
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">Error loading Avatars page</h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <Avatars />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route
            path="badge"
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">Error loading Badges page</h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <Badges />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route
            path="buttons"
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">Error loading Buttons page</h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <Buttons />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route
            path="images"
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">Error loading Images page</h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <Images />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route
            path="videos"
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">Error loading Videos page</h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <Videos />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route
            path="line-chart"
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">Error loading Line Chart page</h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <LineChart />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route
            path="bar-chart"
            element={
              <ErrorBoundary
                fallback={
                  <div className="p-6">
                    <h1 className="text-xl font-semibold text-red-600">Error loading Bar Chart page</h1>
                  </div>
                }
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <BarChart />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Route>

        {/* Fallback routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

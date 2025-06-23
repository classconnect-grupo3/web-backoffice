import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SignIn from "./pages/AuthPages/SignIn"
import NotFound from "./pages/OtherPage/NotFound"
import UserProfiles from "./pages/UserProfiles"
import Videos from "./pages/UiElements/Videos"
import Images from "./pages/UiElements/Images"
import Alerts from "./pages/UiElements/Alerts"
import Badges from "./pages/UiElements/Badges"
import Avatars from "./pages/UiElements/Avatars"
import Buttons from "./pages/UiElements/Buttons"
import LineChart from "./pages/Charts/LineChart"
import BarChart from "./pages/Charts/BarChart"
import Calendar from "./pages/Calendar"
import BasicTables from "./pages/Tables/BasicTables"
import FormElements from "./pages/Forms/FormElements"
import Blank from "./pages/Blank"
import AppLayout from "./layout/AppLayout"
import { ScrollToTop } from "./components/common/ScrollToTop"
import Home from "./pages/Dashboard/Home"
import { ProtectedRoute } from "./components/ProtectedRoute"
import Unauthorized from "./pages/OtherPage/Unauthorized"
import AuthorizeAdmin from "./pages/Users/AuthorizeAdmin"
import BlockUser from "./pages/Users/BlockUser"
import UserManagement from "./pages/Users/UserManagement"
import Statistics from "./pages/Dashboard/Statistics"

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
          <Route index element={<Home />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="authorize-admin" element={<AuthorizeAdmin />} />
          <Route path="block-user" element={<BlockUser />} />
          <Route path="profile" element={<UserProfiles />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="blank" element={<Blank />} />
          <Route path="form-elements" element={<FormElements />} />
          <Route path="basic-tables" element={<BasicTables />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="avatars" element={<Avatars />} />
          <Route path="badge" element={<Badges />} />
          <Route path="buttons" element={<Buttons />} />
          <Route path="images" element={<Images />} />
          <Route path="videos" element={<Videos />} />
          <Route path="line-chart" element={<LineChart />} />
          <Route path="bar-chart" element={<BarChart />} />
        </Route>

        {/* Fallback routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Router>
  )
}

import { Route, Routes } from "react-router-dom";
import Home from "./pages/public/Home";
import Login from "./pages/citizen/Login";
import Register from "./pages/citizen/Register";
import CitizenDashboard from "./pages/citizen/CitizenDashBoard";
import AdminHome from "./pages/public/AdminHome";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { CitizenProvider } from "./context/CitizenContext";
import SuperAdminHome from "./pages/private/SuperAdminHome";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import { SuperProvider } from "./context/SuperContext";
import FwDashboard from "./pages/fw/FwDashboard";
import FwHome from "./pages/public/FwHome";
import { ReportView } from "./pages/private/ReportView";
import FwProfile from "./pages/private/FwProfile";
import AdminProfile from "./pages/private/AdminProfile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/fw_home" element={<FwHome />} />
        <Route path="/super_admin" element={<SuperAdminHome />} />
        <Route path="/admin_home" element={<AdminHome />} />

        <Route path="/my-reports/:id" element={<ReportView />} />

        <Route path="/fw_dash" element={<FwDashboard />} />

        <Route
          path="/super_dash"
          element={
            <SuperProvider>
              <SuperAdminDashboard />
            </SuperProvider>
          }
        />
        <Route
          path="/adminprofile/:id"
          element={
            <SuperProvider>
              <AdminProfile />
            </SuperProvider>
          }
        />
        <Route
          path="/fwprofile/:id"
          element={
            <SuperProvider>
              <FwProfile />
            </SuperProvider>
          }
        />

        <Route
          path="/cdash"
          element={
            <CitizenProvider>
              <CitizenDashboard />
            </CitizenProvider>
          }
        />

        <Route
          path="/my-reports/:id"
          element={
            <CitizenProvider>
              <ReportView />
            </CitizenProvider>
          }
        />

        {/* admin */}
        <Route
          path="/admin_dash"
          element={
            <SuperProvider>
              <AdminDashboard />
            </SuperProvider>
          }
        />

        <Route
          path="/my-reports/:id"
          element={
            <SuperProvider>
              <ReportView />
            </SuperProvider>
          }
        />
      </Routes>
    </>
  );
}

export default App;

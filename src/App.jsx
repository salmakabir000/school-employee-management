import { Routes, Route, Navigate, Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Layout from "./components/Layout.jsx";
import EmployeesPage from "./Employees/EmployeesPage.jsx";
import Leaves from "./pages/leaves/Leaves.jsx";
import Profile from "./pages/Profile.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all 404 */}
        <Route
          path="*"
          element={
            <div className="container">
              <h2>404</h2>
              <Link to="/dashboard">Go Home</Link>
            </div>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
}

export default App;

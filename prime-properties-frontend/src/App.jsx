import React from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Properties from "./pages/Properties";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty"; // Import the new page
import Appointments from "./pages/Appointments";
import ProtectedRoute from "./components/ProtectedRoute";
import Verify from "./pages/verify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import toast from "react-hot-toast";
import "./styles.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  let user = null;
  try { user = userJson ? JSON.parse(userJson) : null; } catch(e) { user = null; }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">PrimeProperties</Link>
        <div className="nav-links">
          <Link to="/" className={isActive("/")}>Browse</Link>
          
          {token ? (
            <>
              {user && user.role === "OWNER" && <Link to="/add" className={isActive("/add")}>Add Property</Link>}
              <Link to="/appointments" className={isActive("/appointments")}>Appointments</Link>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive("/login")}>Login</Link>
              <Link to="/register" className={isActive("/register")}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Properties />} />
          <Route path="/add" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
          {/* NEW ROUTE FOR EDITING */}
          <Route path="/properties/edit/:id" element={<ProtectedRoute><EditProperty /></ProtectedRoute>} />
          
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}
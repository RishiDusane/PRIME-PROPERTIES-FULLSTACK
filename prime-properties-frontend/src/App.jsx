import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  Menu,
  X,
  Home,
  User as UserIcon,
  LogOut,
  Settings,
  LayoutDashboard,
  HelpCircle,
  Calendar,
} from "lucide-react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import Appointments from "./pages/Appointments";
import Verify from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/AdminDashboard";
import Queries from "./pages/Queries";
import ProtectedRoute from "./components/ProtectedRoute";

/* ===============================
   NAVBAR
================================ */
function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand */}
            <Link
              to="/properties"
              className="flex items-center space-x-2 text-xl font-extrabold tracking-tight"
            >
              <Home className="text-blue-500" />
              <span>
                Prime<span className="text-blue-500">Properties</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link to="/properties" className="hover:text-blue-400 transition">
                Properties
              </Link>

              {user && (
                <>
                  <Link
                    to="/appointments"
                    className="hover:text-blue-400 transition"
                  >
                    Appointments
                  </Link>

                  <Link
                    to="/queries"
                    className="hover:text-blue-400 transition"
                  >
                    {user.role === "ADMIN" ? "Support Desk" : "Support"}
                  </Link>

                  {user.role === "ADMIN" && (
                    <Link
                      to="/admin"
                      className="flex items-center hover:text-blue-400 transition"
                    >
                      <LayoutDashboard size={16} className="mr-1" /> Admin
                    </Link>
                  )}

                  {/* Account Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 bg-slate-800 px-3 py-2 rounded-lg hover:bg-slate-700 transition">
                      <UserIcon size={18} />
                      <span>{user.name || "Account"}</span>
                    </button>

                    <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-xl shadow-2xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all border border-slate-100">
                      <Link
                        to="/change-password"
                        className="flex items-center px-4 py-2 hover:bg-slate-50 transition"
                      >
                        <Settings size={16} className="mr-2 text-slate-400" />
                        Settings
                      </Link>
                      <hr className="my-1 border-slate-100" />
                      <button
                        onClick={onLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut size={16} className="mr-2" /> Logout
                      </button>
                    </div>
                  </div>
                </>
              )}

              {!user && (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="hover:text-blue-400 transition">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Button */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-extrabold text-slate-900">
                Menu
              </span>
              <button onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-4 text-slate-700 font-semibold">
              <Link to="/properties" onClick={() => setIsOpen(false)}>
                Properties
              </Link>

              {user && (
                <>
                  <Link to="/appointments" onClick={() => setIsOpen(false)}>
                    <Calendar size={16} className="inline mr-2" />
                    Appointments
                  </Link>

                  <Link to="/queries" onClick={() => setIsOpen(false)}>
                    <HelpCircle size={16} className="inline mr-2" />
                    Support
                  </Link>

                  {user.role === "ADMIN" && (
                    <Link to="/admin" onClick={() => setIsOpen(false)}>
                      <LayoutDashboard size={16} className="inline mr-2" />
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/change-password"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings size={16} className="inline mr-2" />
                    Settings
                  </Link>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onLogout();
                    }}
                    className="text-left text-red-600"
                  >
                    <LogOut size={16} className="inline mr-2" />
                    Logout
                  </button>
                </>
              )}

              {!user && (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

/* ===============================
   APP
================================ */
export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const handleLogout = () => {
    ["token", "user", "role"].forEach((k) => localStorage.removeItem(k));
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      <Toaster position="top-right" />
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Routes>
          <Route path="/" element={<Properties />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            element={
              <ProtectedRoute
                allowedRoles={["CUSTOMER", "OWNER", "ADMIN"]}
              />
            }
          >
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/queries" element={<Queries />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>

          <Route
            element={<ProtectedRoute allowedRoles={["OWNER", "ADMIN"]} />}
          >
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/edit/:id" element={<EditProperty />} />
          </Route>

          <Route
            element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
          >
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route
            path="*"
            element={
              <div className="text-center py-20">
                <h4 className="text-2xl font-bold">404 - Not Found</h4>
                <Link
                  to="/"
                  className="text-blue-600 underline mt-4 inline-block"
                >
                  Go Home
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

import React, { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      onLogin(res.data);
      toast.success(`Welcome, ${res.data.name}!`);
      nav(res.data.role === "ADMIN" ? "/admin" : "/properties");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col justify-center items-center py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-3">Sign in to your account</p>
        </div>
        
        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                placeholder="name@email.com" 
                value={form.email} 
                onChange={e=>setForm({...form, email: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                placeholder="••••••••" 
                value={form.password} 
                onChange={e=>setForm({...form, password: e.target.value})} 
                required 
              />
              <button 
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" size="sm" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Forgot password?</Link>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-blue-200 transition active:scale-[0.98] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-10 text-slate-600 font-medium">
          New here? <button onClick={() => nav("/register")} className="text-blue-600 font-bold hover:underline underline-offset-4 transition">Create account</button>
        </p>
      </div>
    </div>
  );
}


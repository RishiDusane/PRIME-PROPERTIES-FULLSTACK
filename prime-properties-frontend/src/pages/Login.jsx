import React, { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// Import eye icons
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
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
      toast.success(`Welcome back, ${res.data.name || "user"}!`);
      nav("/");
    } catch (err) {
      const msg = err?.response?.data || "Login failed";
      if (String(msg).toLowerCase().includes("not verified")) {
        toast.error("Please verify your email. Check inbox or spam.");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={submit} className="form-card">
        <h2 className="form-title">Welcome Back</h2>
        
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            value={form.email} 
            onChange={e => setForm({...form, email: e.target.value})} 
            placeholder="john@example.com"
            required 
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
              placeholder="••••••••"
              required 
              style={{ width: '100%', paddingRight: '40px' }} // Space for the icon
            />
            {/* Eye Toggle Icon Button */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                padding: '0'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p style={{marginTop: '0.5rem', textAlign: 'center'}}>
          <a href="/forgot-password">Forgot password?</a> • <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}
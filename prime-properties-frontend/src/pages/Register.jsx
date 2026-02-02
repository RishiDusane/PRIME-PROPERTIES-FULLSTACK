import React, { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// Import eye icons
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CUSTOMER" });
  const [loading, setLoading] = useState(false);
  // Add state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      // Hits the registration endpoint in AuthController
      await api.post("/auth/register", form);
      toast.success("Registered — check mail (verify link).");
      nav("/login");
    } catch (err) {
      const data = err?.response?.data;
      const msg = typeof data === "string" ? data : data?.message || (data && typeof data === "object" ? Object.values(data).join(" ") : null) || err.message || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={submit} className="form-card">
        <h2 className="form-title">Create account</h2>
        
        <div className="form-group">
          <label>Name</label>
          <input 
            placeholder="Name" 
            value={form.name} 
            onChange={e=>setForm({...form, name: e.target.value})} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input 
            placeholder="Email" 
            type="email" 
            value={form.email} 
            onChange={e=>setForm({...form, email: e.target.value})} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              placeholder="Password" 
              // Toggle type based on showPassword state
              type={showPassword ? "text" : "password"} 
              value={form.password} 
              onChange={e=>setForm({...form, password: e.target.value})} 
              required 
              style={{ width: '100%', paddingRight: '40px' }}
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

        <div className="form-group">
          <label>Role</label>
          <select value={form.role} onChange={e=>setForm({...form, role: e.target.value})}>
            <option value="CUSTOMER">Customer</option>
            <option value="OWNER">Owner</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
}
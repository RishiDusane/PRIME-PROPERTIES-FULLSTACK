import React, { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
// Import eye icons
import { Eye, EyeOff } from "lucide-react";

export default function ChangePassword() {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [loading, setLoading] = useState(false);
  
  // States to toggle visibility for each field
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Hits the change-password endpoint in AuthController
      // Uses the ChangePasswordRequest DTO
      await api.post("/auth/change-password", { oldPassword, newPassword });
      toast.success("Password changed successfully");
      setOld(""); 
      setNew("");
    } catch (err) {
      toast.error(err?.response?.data || "Change failed");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={submit} className="form-card">
        <h2 className="form-title">Change Password</h2>
        
        <div className="form-group">
          <label>Current Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showOld ? "text" : "password"} 
              value={oldPassword} 
              onChange={e => setOld(e.target.value)} 
              required 
              style={{ width: '100%', paddingRight: '40px' }}
            />
            <button 
              type="button"
              onClick={() => setShowOld(!showOld)}
              style={toggleButtonStyle}
            >
              {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>New Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showNew ? "text" : "password"} 
              value={newPassword} 
              onChange={e => setNew(e.target.value)} 
              minLength={6} 
              required 
              style={{ width: '100%', paddingRight: '40px' }}
            />
            <button 
              type="button"
              onClick={() => setShowNew(!showNew)}
              style={toggleButtonStyle}
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

// Internal style for the toggle buttons
const toggleButtonStyle = {
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
};
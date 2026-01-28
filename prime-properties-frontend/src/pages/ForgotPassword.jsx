import React, { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Hits the forgot-password endpoint defined in AuthController
      await api.post("/auth/forgot-password", { email });
      toast.success("If that email exists, a reset link has been sent.");
      setEmail("");
    } catch (err) {
      toast.error(err?.response?.data || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={submit} className="form-card">
        <h2 className="form-title">Forgot Password</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '1rem' }}>
          Enter your email and we'll send you a link to reset your password.
        </p>
        
        <div className="form-group">
          <label>Email Address</label>
          <input 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            type="email" 
            placeholder="Enter your registered email"
            required 
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          <a href="/login">Back to Login</a>
        </p>
      </form>
    </div>
  );
}
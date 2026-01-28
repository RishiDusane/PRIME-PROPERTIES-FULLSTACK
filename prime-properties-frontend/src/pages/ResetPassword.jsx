import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("No reset token provided");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword: password });
      toast.success("Password reset. Login with your new password.");
      nav("/login");
    } catch (err) {
      toast.error(err?.response?.data || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="form-card">
      <h2>Reset Password</h2>
      <div className="form-group">
        <label>New Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
      </div>
      <button type="submit" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</button>
    </form>
  );
}

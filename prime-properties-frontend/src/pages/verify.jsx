import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";

export default function Verify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (!token) {
      setStatus("no-token");
      return;
    }
    (async () => {
      try {
        await api.get(`/auth/verify?token=${token}`);
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    })();
  }, [token]);

  if (status === "pending") return <div className="auth-container"><div className="form-card">Verifying...</div></div>;
  if (status === "no-token") return <div className="auth-container"><div className="form-card">No token found in the URL.</div></div>;
  if (status === "success") return <div className="auth-container"><div className="form-card">Email verified — <Link to="/login">Login now</Link></div></div>;
  return <div className="auth-container"><div className="form-card">Verification failed or token expired. Try registering again or request a resend.</div></div>;
}

import React, { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddProperty() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", price: "", location: "", imageUrl: "" });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/properties", { ...form, price: Number(form.price) });
      toast.success("Property listed successfully!");
      nav("/");
    } catch (err) {
      toast.error(err?.response?.data || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={submit} className="form-card" style={{ maxWidth: '720px' }}>
        <h2 className="form-title">List Your Property</h2>

        <div className="form-group">
          <label>Property Title</label>
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Modern Apartment" required />
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group">
            <label>Price (₹)</label>
            <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="City, Area" required />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Tell us about the property..." required />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." required />
        </div>

        <button type="submit" disabled={loading}>{loading ? "Publishing..." : "Publish Listing"}</button>
      </form>
    </div>
  );
}

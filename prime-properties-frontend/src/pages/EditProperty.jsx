import React, { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProperty() {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", price: "", location: "", imageUrl: "" });

  useEffect(() => {
    const fetchProp = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        setForm(res.data);
      } catch (err) {
        toast.error("Failed to load property details");
        nav("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProp();
  }, [id, nav]);

  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/properties/${id}`, { ...form, price: Number(form.price) });
      toast.success("Property updated successfully!");
      nav("/");
    } catch (err) {
      toast.error(err?.response?.data || "Failed to update property");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="center" style={{padding:'3rem'}}>Loading...</div>;

  return (
    <div className="auth-container">
      <form onSubmit={submit} className="form-card" style={{ maxWidth: '720px' }}>
        <h2 className="form-title">Edit Property</h2>

        <div className="form-group">
          <label>Property Title</label>
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group">
            <label>Price (₹)</label>
            <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} required />
        </div>

        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Update Property"}</button>
      </form>
    </div>
  );
}
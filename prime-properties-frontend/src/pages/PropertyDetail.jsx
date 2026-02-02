import React, { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bookingForm, setBookingForm] = useState({ date: "", time: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {}
    }
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data);
      } catch {
        toast.error("Property not found");
        navigate("/properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, navigate]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: `/properties/${id}` } });
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/appointments", {
        propertyId: property.id,
        date: bookingForm.date,
        time: bookingForm.time,
      });
      toast.success("Appointment requested!");
      navigate("/appointments");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || "Failed to book";
      toast.error(typeof msg === "string" ? msg : "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="page-container">
      <div className="property-detail-card">
        <img src={property.imageUrl} alt={property.title} className="property-detail-img" />
        <div className="property-detail-content">
          <h1>{property.title}</h1>
          <p className="property-detail-price">₹ {Number(property.price).toLocaleString("en-IN")}</p>
          <p className="property-detail-location">{property.location}</p>
          <p className="property-detail-description">{property.description}</p>

          {user && user.role === "CUSTOMER" && (
            <form onSubmit={handleBookAppointment} className="booking-form">
              <h3>Request a visit</h3>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Submitting..." : "Book appointment"}
              </button>
            </form>
          )}

          {user && (user.role === "OWNER" || user.role === "ADMIN") && user.id === property.ownerId && (
            <Link to={`/edit/${property.id}`} className="btn-primary" style={{ display: "inline-block", marginTop: "1rem" }}>
              Edit property
            </Link>
          )}

          <Link to="/properties" className="back-link" style={{ display: "inline-block", marginTop: "1.5rem" }}>
            ← Back to properties
          </Link>
        </div>
      </div>
    </div>
  );
}

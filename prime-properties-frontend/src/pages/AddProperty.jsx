import React, { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddProperty() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    imageUrl: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    } else {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // We pass the email as a query param because the backend PropertyService 
      // uses it to find the owner entity.
      await api.post(`/properties?email=${currentUser.email}`, formData);
      toast.success("Property added successfully!");
      navigate("/properties");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add property");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0 p-4">
            <h2 className="text-center mb-4 fw-bold">List New Property</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Property Title</label>
                <input name="title" className="form-control" placeholder="e.g. Luxury 2BHK Apartment" onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                <input name="location" className="form-control" placeholder="City, Area" onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Price (₹)</label>
                <input name="price" type="number" className="form-control" onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <input name="imageUrl" className="form-control" placeholder="https://..." onChange={handleChange} />
              </div>
              <div className="mb-4">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-control" rows="3" onChange={handleChange} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">Submit Listing</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
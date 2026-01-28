import React, { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Properties() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from local storage to check ownership
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try { setCurrentUser(JSON.parse(userStr)); } catch(e) {}
    }
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/properties");
      setList(res.data);
    } catch (err) {
      toast.error("Could not load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await api.delete(`/properties/${id}`);
      toast.success("Property deleted");
      setList(list.filter(p => p.id !== id));
    } catch (err) {
      toast.error(err?.response?.data || "Failed to delete");
    }
  };

  // Helper to book (Create Appointment)
  const bookAppointment = async (propertyId) => {
    const date = prompt("Enter Date (YYYY-MM-DD):");
    if(!date) return;
    const time = prompt("Enter Time (HH:MM):");
    if(!time) return;

    try {
      await api.post("/appointments", {
        date,
        time: time + ":00", // ensure HH:MM:SS format if backend requires, or just HH:MM
        status: "PENDING",
        propertyId: propertyId,
        customerId: currentUser.id // Backend might infer this from token, but DTO asks for it
      });
      toast.success("Appointment requested!");
    } catch (err) {
      toast.error(err?.response?.data || "Booking failed");
    }
  };

  if (loading) return <div style={{textAlign:"center", padding:"3rem"}}>Loading properties...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Discover Your Dream Home</h2>
        <p>Explore the finest properties curated just for you</p>
      </div>
      
      {list.length === 0 ? (
        <div style={{textAlign: "center", color: "#64748b"}}>
          <h3>No properties listed yet</h3>
          <p>Be the first to list a property!</p>
        </div>
      ) : (
        <div className="grid">
          {list.map(p => {
            const isOwner = currentUser && currentUser.id === p.ownerId;
            const isCustomer = currentUser && currentUser.role === "CUSTOMER";

            return (
              <div className="card" key={p.id}>
                <div className="card-img-wrapper">
                  <img 
                    src={p.imageUrl || ""} 
                    alt={p.title}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </div>
                <div className="card-content">
                  <h3 className="card-title">{p.title}</h3>
                  <p className="card-desc">{p.description}</p>
                  
                  <div className="card-footer">
                    <div className="location">📍 {p.location}</div>
                    <div className="price">₹ {Number(p.price).toLocaleString('en-IN')}</div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div style={{marginTop: '1rem', display:'flex', gap:'.5rem'}}>
                    {isOwner && (
                      <>
                        <Link to={`/properties/edit/${p.id}`} className="nav-link" style={{background: '#f59e0b', color:'white', padding:'.4rem .8rem', fontSize:'.9rem'}}>Edit</Link>
                        <button onClick={() => handleDelete(p.id)} style={{background: '#ef4444', color:'white', border:'none', padding:'.4rem .8rem', borderRadius:'10px'}}>Delete</button>
                      </>
                    )}
                    {isCustomer && (
                      <button onClick={() => bookAppointment(p.id)} style={{background: 'var(--accent-grad)', flex:1}}>Book Visit</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Appointments() {
  const [list, setList] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if(u) setUser(JSON.parse(u));
    load(); 
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/appointments");
      setList(res.data);
    } catch (err) {
      toast.error("Could not load appointments");
    }
  };

  // Cancel / Delete
  const handleCancel = async (id) => {
    if(!window.confirm("Cancel this appointment?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success("Appointment cancelled");
      setList(list.filter(a => a.id !== id));
    } catch (err) {
      toast.error("Failed to cancel");
    }
  };

  // Update Status (Approve/Reject)
  const handleStatus = async (id, status) => {
    try {
      const res = await api.put(`/appointments/${id}`, { status });
      // Update local state to reflect change immediately
      setList(list.map(a => a.id === id ? { ...a, status: res.data.status } : a));
      toast.success(`Appointment ${status.toLowerCase()}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>My Appointments</h2>
        <p>Manage your visits and requests</p>
      </div>

      {list.length === 0 ? (
        <div className="center small-muted">No appointments found.</div>
      ) : (
        <div className="grid">
          {list.map(a => {
            // Determine badge color
            let badgeClass = "badge badge-pending";
            if(a.status === 'APPROVED') badgeClass = "badge badge-approved";
            if(a.status === 'REJECTED') badgeClass = "badge badge-rejected";

            return (
              <div key={a.id} className="card small">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
                  <h4 style={{margin:0}}>{a.propertyTitle}</h4>
                  <span className={badgeClass}>{a.status}</span>
                </div>
                
                <p className="small-muted" style={{margin:'0.5rem 0'}}>
                  📅 {a.date} &nbsp; ⏰ {a.time}
                </p>

                {/* BUTTONS */}
                <div style={{marginTop:'auto', paddingTop:'0.5rem', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:'0.5rem'}}>
                  
                  {/* CUSTOMER ACTION: CANCEL */}
                  {user && user.role === 'CUSTOMER' && (
                    <button 
                      onClick={() => handleCancel(a.id)}
                      style={{fontSize:'.85rem', padding:'.4rem', background:'#ef4444', width:'100%'}}
                    >
                      Cancel Booking
                    </button>
                  )}

                  {/* OWNER ACTIONS: APPROVE / REJECT */}
                  {user && user.role === 'OWNER' && a.status === 'PENDING' && (
                    <>
                      <button 
                        onClick={() => handleStatus(a.id, "APPROVED")}
                        style={{fontSize:'.85rem', padding:'.4rem', background:'var(--success)', flex:1}}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatus(a.id, "REJECTED")}
                        style={{fontSize:'.85rem', padding:'.4rem', background:'var(--danger)', flex:1}}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
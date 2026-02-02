import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { MapPin, Plus, Home } from "lucide-react";

export default function Properties() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const errorShown = useRef(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) { try { setCurrentUser(JSON.parse(userStr)); } catch (e) {} }

    const fetchProperties = async () => {
      try {
        const res = await api.get("/properties");
        setList(res.data);
      } catch (err) {
        if (!errorShown.current) {
          toast.error("Could not fetch properties");
          errorShown.current = true;
        }
      } finally { setLoading(false); }
    };
    fetchProperties();
  }, []);

if (loading) return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="skeleton-card">
        <div className="skeleton skeleton-img mb-4"></div>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-btn mt-4"></div>
      </div>
    ))}
  </div>
);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Available Properties</h2>
          <p className="text-slate-500 mt-1">Discover your next dream home in Pune.</p>
        </div>
        
        {(currentUser?.role === "OWNER" || currentUser?.role === "ADMIN") && (
          <Link to="/add-property" className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
            <Plus className="mr-2" size={20} /> Add Listing
          </Link>
        )}
      </div>

      {list.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-20 text-center">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="text-slate-400" />
          </div>
          <p className="text-slate-500">No properties found at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((p) => (
            <div key={p.id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={p.imageUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600"}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  alt={p.title}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-md text-blue-700 font-extrabold px-3 py-1.5 rounded-lg shadow-sm">
                    ₹{p.price.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h5 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition">{p.title}</h5>
                <p className="flex items-center text-slate-500 text-sm mb-6">
                  <MapPin size={16} className="mr-1 text-slate-400" /> {p.location}
                </p>
                <Link to={`/properties/${p.id}`} className="block text-center w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-100">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
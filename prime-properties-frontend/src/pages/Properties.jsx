import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Plus, Home, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function Properties() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    page: parseInt(searchParams.get("page") || "0"),
  });

  const isMounted = useRef(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) { try { setCurrentUser(JSON.parse(userStr)); } catch (e) { } }
    isMounted.current = true;
  }, []);

  useEffect(() => {
    fetchProperties();
    setSearchParams({
      city: filters.city,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      page: filters.page
    });
  }, [filters.page]); // Trigger on page change

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {
        city: filters.city || null,
        minPrice: filters.minPrice || null,
        maxPrice: filters.maxPrice || null,
        page: filters.page,
        size: 6
      };

      const res = await api.get("/properties", { params });

      if (res.data && res.data.content) {
        setList(res.data.content);
        setTotalPages(res.data.totalPages);
      } else if (Array.isArray(res.data)) {
        setList(res.data);
        setTotalPages(1);
      } else {
        setList([]);
      }
    } catch (err) {
      toast.error("Could not fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 0 })); // Reset to page 0
    fetchProperties();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-slate-200 pb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Available Properties</h2>
            <p className="text-slate-500 mt-1">Discover your next dream home.</p>
          </div>
          {(currentUser?.role === "OWNER" || currentUser?.role === "ADMIN") && (
            <Link to="/add-property" className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
              <Plus className="mr-2" size={20} /> Add Listing
            </Link>
          )}
        </div>

        {/* Filters Bar */}
        <form onSubmit={handleSearch} className="bg-slate-50 p-4 rounded-2xl flex flex-wrap gap-4 border border-slate-200 shadow-sm items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">City</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="e.g. Mumbai"
                value={filters.city}
                onChange={e => handleFilterChange('city', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="w-32">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Min Price</label>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={e => handleFilterChange('minPrice', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
            />
          </div>

          <div className="w-32">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Max Price</label>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={e => handleFilterChange('maxPrice', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
            />
          </div>

          <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg h-[46px] flex items-center">
            <Search size={20} className="mr-2" /> Filter
          </button>
        </form>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-[380px]">
              <div className="h-48 bg-slate-100 animate-pulse"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-slate-100 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2"></div>
                <div className="h-10 bg-slate-100 rounded animate-pulse mt-6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-20 text-center">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No properties match your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((p) => (
              <div key={p.id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={p.imageUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600"}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    alt={p.title}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur-md text-slate-900 font-extrabold px-3 py-1.5 rounded-lg shadow-sm text-sm">
                      ₹ {Number(p.price).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h5 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition line-clamp-1">{p.title}</h5>
                  <p className="flex items-center text-slate-500 text-sm mb-6">
                    <MapPin size={16} className="mr-1 text-slate-400" /> {p.location}
                  </p>
                  <div className="mt-auto">
                    <Link to={`/properties/${p.id}`} className="block text-center w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-100">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 pt-8 border-t border-slate-100">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 0}
                className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={24} />
              </button>
              <span className="font-bold text-slate-600">
                Page {filters.page + 1} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= totalPages - 1}
                className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { Users, Home, Calendar, CheckCircle, Clock, IndianRupee, Layers } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, properties: 0, bookings: 0, revenue: 0 });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then(res => setStats(res.data))
      .catch(() => toast.error("Failed to load admin stats"));
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoadingUsers(true);
    api.get("/admin/users")
      .then(res => setUsers(res.data || []))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoadingUsers(false));
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin Control</h1>
        <p className="text-slate-500 mt-2">Oversee all system activities and users.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Users" value={stats.users} color="blue" icon={<Users size={24} />} />
        <StatCard label="Total Listings" value={stats.properties} color="emerald" icon={<Home size={24} />} />
        <StatCard label="Total Bookings" value={stats.bookings} color="purple" icon={<Layers size={24} />} />
        <StatCard
          label="Total Revenue"
          value={`₹${stats.revenue ? stats.revenue.toLocaleString('en-IN') : '0'}`} // Assuming backend sends revenue
          color="amber"
          icon={<IndianRupee size={24} />}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">System Users</h2>
          <button onClick={loadUsers} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition shadow-sm">Refresh</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white text-xs uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5 font-bold">User Information</th>
                <th className="px-8 py-5 font-bold">Role</th>
                <th className="px-8 py-5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingUsers ? (
                <tr><td colSpan={3} className="px-8 py-20 text-center text-slate-400 italic font-medium">Loading user database...</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition duration-150">
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-sm text-slate-500">{u.email}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {u.verified ?
                        <span className="flex items-center text-emerald-600 text-sm font-bold"><CheckCircle size={16} className="mr-1.5" /> Verified</span> :
                        <span className="flex items-center text-slate-400 text-sm font-bold italic"><Clock size={16} className="mr-1.5" /> Pending</span>
                      }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100"
  };
  return (
    <div className={`p-8 rounded-3xl border-2 flex items-center space-x-6 bg-white transition hover:shadow-xl duration-300`}>
      <div className={`p-4 rounded-2xl ${colors[color]}`}>{icon}</div>
      <div>
        <div className="text-2xl font-black text-slate-900 truncate">{value}</div>
        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{label}</div>
      </div>
    </div>
  );
}
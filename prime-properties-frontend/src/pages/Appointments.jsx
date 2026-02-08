import React, { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

import BookingTimeline from "../components/BookingTimeline";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch { }
    }
    fetchAppointments();
    fetchBookings();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments");
      setAppointments(res.data || []);
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data || []);
    } catch {
      setBookings([]);
    }
  };

  const hasBookingForAppointment = (appointmentId) =>
    bookings.some((b) => b.appointmentId === appointmentId);

  const getBookingForAppointment = (appointmentId) => bookings.find((b) => b.appointmentId === appointmentId);

  const handlePay = async (appointmentId) => {
    if (payingId) return; // Prevent double clicks
    setPayingId(appointmentId);
    try {
      // 1. Create Booking
      const bookRes = await api.post("/bookings", { appointmentId });
      const bookingId = bookRes.data.id;

      // 2. Process Payment with explicit method
      await api.post("/payments", {
        bookingId,
        paymentMethod: "CARD"
      });

      toast.success("Payment successful! Receipt available.");
      fetchBookings(); // Refresh bookings to show receipt button
      fetchAppointments();
    } catch (err) {
      console.error("Payment error:", err);
      let msg = "Payment failed. Please try again.";

      if (err.response) {
        // Use backend error message if available
        if (err.response.data && typeof err.response.data === 'string') {
          msg = err.response.data;
        } else if (err.response.data && err.response.data.message) {
          msg = err.response.data.message;
        }

        if (err.response.status === 500) {
          msg = "Server error processing payment. Support notified.";
        }
      }
      toast.error(msg);
    } finally {
      setPayingId(null);
    }
  };

  const handleDownloadReceipt = async (paymentId) => {
    try {
      const res = await api.get(`/payments/${paymentId}/receipt/pdf`, { responseType: "blob" });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Ideally the backend header sets the filename, but we can default
      link.download = `payment-${paymentId}-receipt.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Failed to download PDF receipt");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success(`Appointment ${status.toLowerCase()}`);
      fetchAppointments();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data;
      toast.error(typeof msg === "string" ? msg : "Update failed");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Appointments
        </h2>
        <p className="text-slate-500 mt-1">
          View and manage property visits and bookings.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
          Loading appointments...
        </div>
      )}

      {/* Empty State */}
      {!loading && appointments.length === 0 && (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-500">
          No appointments yet.
        </div>
      )}

      {/* Table */}
      {!loading && appointments.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Status & Timeline</th>
                  {user?.role === "CUSTOMER" && <th className="px-6 py-4">Payment</th>}
                  {user?.role !== "CUSTOMER" && <th className="px-6 py-4">Actions</th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {a.propertyTitle}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {a.customerName ?? "—"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {a.date}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {typeof a.time === "string" ? a.time.slice(0, 5) : a.time}
                    </td>

                    <td className="px-6 py-4">
                      <BookingTimeline appointment={a} booking={getBookingForAppointment(a.id)} />
                    </td>

                    {/* CUSTOMER PAYMENT */}
                    {user?.role === "CUSTOMER" && (
                      <td className="px-6 py-4">
                        {a.status === "APPROVED" && (
                          (() => {
                            const b = getBookingForAppointment(a.id);
                            if (b) {
                              return (
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                    Paid
                                  </span>
                                  {b.paymentId && (
                                    <button
                                      onClick={() => handleDownloadReceipt(b.paymentId)}
                                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg transition"
                                    >
                                      Download Payment Slip
                                    </button>
                                  )}
                                </div>
                              );
                            }
                            return (
                              <button
                                onClick={() => handlePay(a.id)}
                                disabled={payingId === a.id}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl transition disabled:opacity-60"
                              >
                                {payingId === a.id ? "Processing..." : "Pay"}
                              </button>
                            );
                          })()
                        )}
                      </td>
                    )}

                    {/* OWNER / ADMIN ACTIONS */}
                    {user?.role !== "CUSTOMER" && (
                      <td className="px-6 py-4">
                        {a.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(a.id, "APPROVED")}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(a.id, "REJECTED")}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

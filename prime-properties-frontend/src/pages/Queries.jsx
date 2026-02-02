import React, { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Queries() {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const [queries, setQueries] = useState([]);
  const [reply, setReply] = useState({});
  const [status, setStatus] = useState({});
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res =
        user?.role === "ADMIN"
          ? await api.get("/queries/all")
          : await api.get("/queries/my");

      setQueries(res.data || []);
    } catch {
      toast.error("Failed to load queries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submitQuery = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      await api.post("/queries", {
        subject: subject.trim(),
        description: description.trim(),
      });
      toast.success("Query submitted successfully");
      setSubject("");
      setDescription("");
      load();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data;
      toast.error(typeof msg === "string" ? msg : "Failed to submit query");
    } finally {
      setSubmitting(false);
    }
  };

  const respond = async (id) => {
    try {
      await api.put(`/queries/${id}/respond`, {
        adminResponse: reply[id] || "",
        status: status[id] || "RESOLVED",
      });
      toast.success("Response sent");
      setReply((prev) => ({ ...prev, [id]: "" }));
      load();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data;
      toast.error(typeof msg === "string" ? msg : "Failed to respond");
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {user?.role === "ADMIN" ? "Support Desk" : "My Support Queries"}
        </h2>
        <p className="text-slate-500 mt-1">
          {user?.role === "ADMIN"
            ? "Manage and respond to all customer queries."
            : "Raise and track your support requests."}
        </p>
      </div>

      {/* Raise Query (Customer Only) */}
      {user?.role !== "ADMIN" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Raise a new query
          </h3>

          <form onSubmit={submitQuery} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Subject
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Short summary of your issue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain your issue in detail..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Query"}
            </button>
          </form>
        </div>
      )}

      {/* Queries List */}
      <div className="space-y-4">
        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
            Loading queries...
          </div>
        )}

        {!loading && queries.length === 0 && (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500">
            No queries found.
          </div>
        )}

        {queries.map((q) => (
          <div
            key={q.id}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {q.subject}
                </h4>
                <p className="text-slate-600 mt-1">{q.description}</p>
              </div>

              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider
                  ${
                    q.status === "RESOLVED"
                      ? "bg-emerald-100 text-emerald-700"
                      : q.status === "IN_PROGRESS"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
              >
                {q.status}
              </span>
            </div>

            {q.adminResponse && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
                <strong className="text-slate-700">Admin response:</strong>
                <p className="text-slate-600 mt-1">{q.adminResponse}</p>
              </div>
            )}

            {/* Admin Actions */}
            {user?.role === "ADMIN" && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <textarea
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
                  rows={3}
                  placeholder="Type your response..."
                  value={reply[q.id] || ""}
                  onChange={(e) =>
                    setReply((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                />

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <select
                    className="rounded-xl border border-slate-200 px-3 py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
                    value={status[q.id] || "IN_PROGRESS"}
                    onChange={(e) =>
                      setStatus((prev) => ({
                        ...prev,
                        [q.id]: e.target.value,
                      }))
                    }
                  >
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>

                  <button
                    onClick={() => respond(q.id)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl transition"
                  >
                    Send Response
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

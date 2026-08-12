import { useState, useEffect } from "react";
import api from "../../services/api";

const emptyForm = {
  title: "",
  description: "",
  level: "",
  startTime: "",
  endTime: "",
  capacity: 30,
  price: 0,
  currency: "GBP",
};

export default function ClassManager() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [registrations, setRegistrations] = useState({});

  const loadClasses = async () => {
    try {
      const res = await api.get("/admin/classes");
      setClasses(res.data);
    } catch {
      setMessage({ type: "error", text: "Could not load classes." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      await api.post("/admin/classes", form);
      setForm(emptyForm);
      setShowForm(false);
      setMessage({ type: "success", text: "Class created as a draft." });
      loadClasses();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Could not create class.",
      });
    }
  };

  const handlePublish = async (id) => {
    setMessage({ type: "", text: "" });

    try {
      await api.post(`/admin/classes/${id}/publish`);
      setMessage({
        type: "success",
        text: "Published. Google Meet link created and the class is now live.",
      });
      loadClasses();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Could not publish class.",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class? All registrations will be removed.")) return;

    try {
      await api.delete(`/admin/classes/${id}`);
      setMessage({ type: "success", text: "Class deleted." });
      loadClasses();
    } catch {
      setMessage({ type: "error", text: "Could not delete class." });
    }
  };

  const toggleRegistrations = async (id) => {
    if (registrations[id]) {
      setRegistrations({ ...registrations, [id]: null });
      return;
    }

    try {
      const res = await api.get(`/admin/classes/${id}/registrations`);
      setRegistrations({ ...registrations, [id]: res.data });
    } catch {
      setMessage({ type: "error", text: "Could not load registrations." });
    }
  };

  const formatTime = (t) =>
    new Date(t).toLocaleString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const inputClass =
    "w-full bg-bg border border-border rounded-lg px-3 py-2 text-slate text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  const statusStyle = {
    draft: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading font-bold text-lg text-slate">Classes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-accent-soft transition-colors"
        >
          {showForm ? "Close" : "New Class"}
        </button>
      </div>

      {message.text && (
        <p
          className={`text-sm mb-4 ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-bg border border-border rounded-lg p-5 mb-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">
              Title<span className="text-accent ml-0.5">*</span>
            </label>
            <input
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. BMO Round 1: Number Theory Techniques"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Level
              </label>
              <input
                name="level"
                value={form.level}
                onChange={handleChange}
                placeholder="e.g. A-level, Olympiad"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Capacity
              </label>
              <input
                name="capacity"
                type="number"
                min="1"
                value={form.capacity}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Start<span className="text-accent ml-0.5">*</span>
              </label>
              <input
                name="startTime"
                type="datetime-local"
                required
                value={form.startTime}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                End<span className="text-accent ml-0.5">*</span>
              </label>
              <input
                name="endTime"
                type="datetime-local"
                required
                value={form.endTime}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Price (0 for free)
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-soft transition-colors"
          >
            Create Class
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-text-muted text-sm">Loading...</p>
      ) : classes.length === 0 ? (
        <p className="text-text-muted text-sm">No classes yet.</p>
      ) : (
        <div className="space-y-4">
          {classes.map((c) => (
            <div key={c.id} className="bg-bg border border-border rounded-lg p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate">{c.title}</p>
                  <p className="text-sm text-text-muted mt-1">
                    {formatTime(c.start_time)} · {c.registered}/{c.capacity} registered
                    {Number(c.price) > 0 && ` · ${c.currency} ${Number(c.price).toFixed(2)}`}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded ${statusStyle[c.status]}`}
                >
                  {c.status}
                </span>
              </div>

              {c.meeting_link && (
                <p className="text-sm mt-2">
                  
                    <a href={c.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline break-all"
                  >
                    {c.meeting_link}
                  </a>
                </p>
              )}

              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
                {c.status === "draft" && (
                  <button
                    onClick={() => handlePublish(c.id)}
                    className="border-2 border-slate text-slate text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate hover:text-white transition-colors"
                  >
                    Publish &amp; Create Meet Link
                  </button>
                )}
                <button
                  onClick={() => toggleRegistrations(c.id)}
                  className="text-sm text-slate px-3 py-2 hover:underline"
                >
                  {registrations[c.id] ? "Hide" : "View"} registrations
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-sm text-red-600 px-3 py-2 hover:underline"
                >
                  Delete
                </button>
              </div>

              {registrations[c.id] && (
                <div className="mt-4 pt-4 border-t border-border">
                  {registrations[c.id].length === 0 ? (
                    <p className="text-sm text-text-muted">No registrations yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {registrations[c.id].map((r) => (
                        <li
                          key={r.id}
                          className="flex flex-wrap justify-between gap-2 text-sm"
                        >
                          <span className="text-slate">{r.name}</span>
                          
                            <a href={`mailto:${r.email}`}
                            className="text-accent hover:underline"
                          >
                            {r.email}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
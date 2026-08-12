import { useState, useEffect } from "react";
import api from "../../services/api";

export default function SlotManager() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ startTime: "", endTime: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadSlots = async () => {
    try {
      const res = await api.get("/admin/slots");
      setSlots(res.data);
    } catch {
      setError("Could not load slots.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/admin/slots", form);
      setForm({ startTime: "", endTime: "" });
      loadSlots();
    } catch (err) {
      setError(err.response?.data?.error || "Could not add slot.");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await api.delete(`/admin/slots/${id}`);
      loadSlots();
    } catch (err) {
      setError(err.response?.data?.error || "Could not delete slot.");
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
    "bg-surface border border-border rounded-lg px-3 py-2 text-slate text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h2 className="font-heading font-bold text-lg text-slate mb-5">
        Availability
      </h2>

      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3 mb-6">
        <div>
          <label htmlFor="startTime" className="block text-xs text-text-muted mb-1">
            Start
          </label>
          <input
            id="startTime"
            type="datetime-local"
            required
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-xs text-text-muted mb-1">
            End
          </label>
          <input
            id="endTime"
            type="datetime-local"
            required
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          className="bg-accent text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-accent-soft transition-colors"
        >
          Add Slot
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-text-muted text-sm">Loading...</p>
      ) : slots.length === 0 ? (
        <p className="text-text-muted text-sm">No slots yet.</p>
      ) : (
        <div className="space-y-2">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between gap-4 bg-bg border border-border rounded-lg px-4 py-2.5"
            >
              <span className="text-sm text-slate">
                {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    slot.is_booked
                      ? "bg-slate text-white"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {slot.is_booked ? "Booked" : "Open"}
                </span>
                {!slot.is_booked && (
                  <button
                    onClick={() => handleDelete(slot.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
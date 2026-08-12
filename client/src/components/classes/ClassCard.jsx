import { useState } from "react";
import api from "../../services/api";

export default function ClassCard({ session, onRegistered }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const seatsLeft = session.capacity - session.registered;
  const isFull = seatsLeft <= 0;

  const dateLabel = new Date(session.start_time).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const timeLabel = `${new Date(session.start_time).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })} – ${new Date(session.end_time).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  const priceLabel =
    Number(session.price) > 0
      ? `${session.currency} ${Number(session.price).toFixed(2)}`
      : "Free";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    try {
      await api.post(`/classes/${session.id}/register`, form);
      setStatus({
        state: "success",
        message: "You're registered. Check your email for the join link.",
      });
      setForm({ name: "", email: "" });
      onRegistered?.();
    } catch (err) {
      setStatus({
        state: "error",
        message: err.response?.data?.error || "Could not register. Please try again.",
      });
    }
  };

  const inputClass =
    "w-full bg-bg border border-border rounded-lg px-4 py-2 text-slate text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {session.level && (
            <span className="inline-block bg-slate text-white text-xs font-semibold px-2.5 py-1 rounded mb-3">
              {session.level}
            </span>
          )}
          <h3 className="font-heading font-bold text-lg text-slate">
            {session.title}
          </h3>
        </div>
        <span className="font-heading font-bold text-lg text-accent">
          {priceLabel}
        </span>
      </div>

      {session.description && (
        <p className="text-text-muted text-sm mt-3 leading-relaxed">
          {session.description}
        </p>
      )}

      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-sm">
        <span className="text-slate">{dateLabel}</span>
        <span className="text-text-muted">{timeLabel}</span>
        <span className={isFull ? "text-red-600" : "text-text-muted"}>
          {isFull ? "Fully booked" : `${seatsLeft} of ${session.capacity} seats left`}
        </span>
      </div>

      <div className="mt-5 pt-5 border-t border-border">
        {status.state === "success" ? (
          <p className="text-sm text-green-600">{status.message}</p>
        ) : isFull ? (
          <p className="text-sm text-text-muted">
            This class is full. Get in touch if you'd like to be told about the next one.
          </p>
        ) : open ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-text-muted text-sm">
              Fields marked <span className="text-accent">*</span> are required.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor={`name-${session.id}`}
                  className="block text-xs font-medium text-text-muted mb-1"
                >
                  Name<span className="text-accent ml-0.5">*</span>
                </label>
                <input
                  id={`name-${session.id}`}
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor={`email-${session.id}`}
                  className="block text-xs font-medium text-text-muted mb-1"
                >
                  Email<span className="text-accent ml-0.5">*</span>
                </label>
                <input
                  id={`email-${session.id}`}
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            {Number(session.price) > 0 && (
              <p className="text-xs text-text-muted">
                Payment details will be sent by email after you register.
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={status.state === "loading"}
                className="bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-soft transition-colors disabled:opacity-60"
              >
                {status.state === "loading" ? "Registering..." : "Confirm Registration"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-text-muted px-3 hover:text-slate"
              >
                Cancel
              </button>
            </div>

            {status.state === "error" && (
              <p className="text-sm text-red-600">{status.message}</p>
            )}
          </form>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-soft transition-colors"
          >
            Reserve a Seat
          </button>
        )}
      </div>
    </div>
  );
}
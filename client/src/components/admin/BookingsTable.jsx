import { useState, useEffect } from "react";
import api from "../../services/api";

export default function BookingsTable() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [confirming, setConfirming] = useState(false);

  const loadBookings = async () => {
    try {
      const res = await api.get("/admin/bookings");
      setBookings(res.data);
    } catch {
      setMessage({
        type: "error",
        text: "Could not load bookings.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleConfirm = async (id) => {
    setMessage({ type: "", text: "" });
    setConfirming(true);

    try {
      const res = await api.post(`/admin/bookings/${id}/confirm`, {
        meetingLink: meetingLink.trim() || undefined,
      });
      setMessage({
        type: res.data.warning ? "error" : "success",
        text:
          res.data.warning ||
          "Confirmed. Calendar invite and Meet link sent to the client.",
      });
      setActiveId(null);
      setMeetingLink("");
      loadBookings();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Could not confirm booking.",
      });
    } finally {
      setConfirming(false);
    }
  };

  const handleCancel = async (id) => {
    if (
      !window.confirm(
        "Cancel this booking? The slot will become available again."
      )
    ) {
      return;
    }

    try {
      await api.post(`/admin/bookings/${id}/cancel`);

      setMessage({
        type: "success",
        text: "Booking cancelled.",
      });

      loadBookings();
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.error ||
          "Could not cancel booking.",
      });
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

  const statusStyle = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h2 className="font-heading font-bold text-lg text-slate mb-5">
        Bookings
      </h2>

      {message.text && (
        <p
          className={`text-sm mb-4 ${
            message.type === "success"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}

      {loading ? (
        <p className="text-text-muted text-sm">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-text-muted text-sm">No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-bg border border-border rounded-lg p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate">
                    {b.name}
                  </p>

                  <a
                    href={`mailto:${b.email}`}
                    className="text-sm text-accent hover:underline"
                  >
                    {b.email}
                  </a>
                </div>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded ${
                    statusStyle[b.status]
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <p className="text-sm text-slate mt-3">
                <span className="text-text-muted">Time:</span>{" "}
                {formatTime(b.start_time)}
              </p>

              <p className="text-sm text-slate mt-1">
                <span className="text-text-muted">Topic:</span>{" "}
                {b.topic}
              </p>

              {b.notes && (
                <p className="text-sm text-text-muted mt-1">
                  Notes: {b.notes}
                </p>
              )}

              {b.meeting_link && (
                <p className="text-sm mt-1">
                  <span className="text-text-muted">Link:</span>{" "}
                  <a
                    href={b.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline break-all"
                  >
                    {b.meeting_link}
                  </a>
                </p>
              )}

              {b.status !== "cancelled" && (
                <div className="mt-4 pt-4 border-t border-border">
                  {activeId === b.id ? (<div className="space-y-3">
                      <p className="text-sm text-text-muted">
                        A Google Meet link and calendar invite will be created
                        automatically. Leave the field blank unless you want to
                        use your own link.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="url"
                          placeholder="Optional: your own Zoom/Meet link"
                          value={meetingLink}
                          onChange={(e) => setMeetingLink(e.target.value)}
                          className="flex-1 min-w-[240px] bg-surface border border-border rounded-lg px-3 py-2 text-sm text-slate focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <button
                          onClick={() => handleConfirm(b.id)}
                          disabled={confirming}
                          className="bg-accent text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-accent-soft transition-colors disabled:opacity-60"
                        >
                          {confirming ? "Creating..." : "Confirm & Create Meeting"}
                        </button>
                        <button
                          onClick={() => {
                            setActiveId(null);
                            setMeetingLink("");
                          }}
                          className="text-sm text-text-muted px-3 py-2 hover:text-slate"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setActiveId(b.id)}
                        className="border-2 border-slate text-slate text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate hover:text-white transition-colors"
                      >
                        {b.status === "confirmed"
                          ? "Resend Link"
                          : "Confirm & Send Link"}
                      </button>

                      <button
                        onClick={() => handleCancel(b.id)}
                        className="text-sm text-red-600 px-3 py-2 hover:underline"
                      >
                        Cancel Booking
                      </button>
                    </div>
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
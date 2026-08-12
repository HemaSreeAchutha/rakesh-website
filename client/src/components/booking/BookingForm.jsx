import { useState, useEffect } from "react";
import api from "../../services/api";
import SlotPicker from "./SlotPicker";

const Required = () => <span className="text-accent ml-0.5">*</span>;

export default function BookingForm() {
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", topic: "", notes: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    api
      .get("/booking/slots")
      .then((res) => setSlots(res.data))
      .catch(() => setStatus({ state: "error", message: "Could not load available slots." }))
      .finally(() => setLoadingSlots(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlotId) {
      setStatus({ state: "error", message: "Please select a time slot." });
      return;
    }

    setStatus({ state: "loading", message: "" });

    try {
      await api.post("/booking", { slotId: selectedSlotId, ...formData });
      setStatus({
        state: "success",
        message: "Booking confirmed. Check your email for details.",
      });
      setFormData({ name: "", email: "", topic: "", notes: "" });
      setSelectedSlotId(null);
      // Refresh slots so the booked one disappears
      const res = await api.get("/booking/slots");
      setSlots(res.data);
    } catch (error) {
      setStatus({
        state: "error",
        message: error.response?.data?.error || "Something went wrong. Please try again.",
      });
    }
  };

  const inputClass =
    "w-full bg-surface border border-border rounded-lg px-4 py-2 text-slate focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="max-w-2xl space-y-10">
      {/* Step 1 */}
      <section>
        <p className="text-text-muted text-sm mb-5">
          Fields marked <span className="text-accent">*</span> are required.
        </p>
        <h2 className="font-heading font-bold text-lg text-slate mb-1">
          1. Pick a time<Required />
        </h2>
        <p className="text-text-muted text-sm mb-4">
          All times shown in your local timezone.
        </p>
        {loadingSlots ? (
          <p className="text-text-muted text-sm">Loading available slots...</p>
        ) : (
          <SlotPicker
            slots={slots}
            selectedSlotId={selectedSlotId}
            onSelect={setSelectedSlotId}
          />
        )}
      </section>

      {/* Step 2 */}
      <section>
        <h2 className="font-heading font-bold text-lg text-slate mb-4">
          2. Your details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-1">
              Name<Required />
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-1">
              Email<Required />
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-text-muted mb-1">
              What would you like to discuss?<Required />
            </label>
            <input
              id="topic"
              name="topic"
              type="text"
              required
              placeholder="e.g. STEP III preparation, PhD application advice"
              value={formData.topic}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-text-muted mb-1">
              Anything else I should know?{" "}
              <span className="font-normal text-text-muted/70">(optional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={status.state === "loading"}
            className="bg-accent text-white font-semibold px-6 py-3 rounded-lg hover:bg-accent-soft transition-colors disabled:opacity-60"
          >
            {status.state === "loading" ? "Booking..." : "Confirm Booking"}
          </button>

          {status.message && (
            <p
              className={`text-sm ${
                status.state === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status.message}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
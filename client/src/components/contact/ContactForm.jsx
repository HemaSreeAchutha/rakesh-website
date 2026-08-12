import { useState } from "react";
import api from "../../services/api";

const Required = () => <span className="text-accent ml-0.5">*</span>;

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    try {
      await api.post("/contact", formData);
      setStatus({ state: "success", message: "Message sent — I'll get back to you soon." });
      setFormData({ name: "", email: "", message: "" });
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
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <p className="text-text-muted text-sm">
        Fields marked <span className="text-accent">*</span> are required.
      </p>
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
        <label htmlFor="message" className="block text-sm font-medium text-text-muted mb-1">
          Message<Required />
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={formData.message}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status.state === "loading"}
        className="bg-accent text-white font-semibold px-6 py-3 rounded-lg hover:bg-accent-soft transition-colors disabled:opacity-60"
      >
        {status.state === "loading" ? "Sending..." : "Send Message"}
      </button>

      {status.message && (
        <p className={`text-sm ${status.state === "success" ? "text-green-600" : "text-red-600"}`}>
          {status.message}
        </p>
      )}
    </form>
  );
}
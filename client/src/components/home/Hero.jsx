import { Link } from "react-router-dom";
import { profile, proofPoints } from "../../data/resumeData";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
      <p className="text-accent text-sm font-semibold tracking-wide uppercase mb-4">
        {profile.roles.join(" · ")}
      </p>

      <h1 className="font-heading font-extrabold text-4xl md:text-6xl text-slate leading-[1.1] max-w-3xl">
        {profile.name}
      </h1>

      <p className="text-text-muted mt-6 max-w-2xl text-lg leading-relaxed">
        {profile.tagline}
      </p>

      <div className="flex flex-wrap gap-4 mt-8">
        <Link
          to="/booking"
          className="bg-accent text-white font-semibold px-6 py-3 rounded-lg hover:bg-accent-soft transition-colors"
        >
          Book a Consultation
        </Link>
        <Link
          to="/classes"
          className="border-2 border-slate text-slate font-semibold px-6 py-3 rounded-lg hover:bg-slate hover:text-white transition-colors"
        >
          View Live Classes
        </Link>
      </div>

      {/* Proof strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mt-16 rounded-xl overflow-hidden border border-border">
        {proofPoints.map((point) => (
          <div key={point.label} className="bg-surface px-5 py-6">
            <p className="font-heading font-extrabold text-2xl text-slate">
              {point.value}
            </p>
            <p className="text-text-muted text-sm mt-1">{point.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
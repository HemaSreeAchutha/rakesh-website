import { Link } from "react-router-dom";
import { teaching } from "../../data/resumeData";

export default function Teaching() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="font-heading font-bold text-3xl text-slate mb-3">
        Teaching
      </h2>
      <p className="text-text-muted mb-12 max-w-2xl">{teaching.intro}</p>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Roles */}
        <div className="lg:col-span-2 space-y-6">
          {teaching.roles.map((role) => (
            <div
              key={role.title}
              className="bg-surface border border-border rounded-xl p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-heading font-bold text-slate">
                  {role.title}
                </h3>
                <span className="text-text-muted text-sm">{role.period}</span>
              </div>
              <p className="text-accent text-sm font-medium mt-1">{role.org}</p>
              <p className="text-text-muted text-sm mt-3 leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>

        {/* What I teach */}
        <div className="bg-slate rounded-xl p-8 h-fit lg:sticky lg:top-24">
          <p className="text-white/60 text-xs font-semibold tracking-wide uppercase mb-5">
            What I teach
          </p>
          <ul className="space-y-3 mb-8">
            {teaching.offerings.map((offering) => (
              <li key={offering} className="text-white text-sm flex gap-3">
                <span className="text-accent">▸</span>
                <span>{offering}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/booking"
            className="block bg-accent text-white text-center font-semibold px-6 py-3 rounded-lg hover:bg-accent-soft transition-colors"
          >
            Book a Session
          </Link>
        </div>
      </div>
    </section>
  );
}
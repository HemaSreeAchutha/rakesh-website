import { about } from "../../data/resumeData";

export default function About() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="font-heading font-bold text-3xl text-slate mb-10">
        About
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-surface border border-border rounded-xl p-8">
          <p className="text-accent text-xs font-semibold tracking-wide uppercase mb-4">
            Research
          </p>
          <p className="text-text-muted leading-relaxed">{about.research}</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-8">
          <p className="text-accent text-xs font-semibold tracking-wide uppercase mb-4">
            Teaching
          </p>
          <p className="text-text-muted leading-relaxed">{about.teaching}</p>
        </div>
      </div>
    </section>
  );
}
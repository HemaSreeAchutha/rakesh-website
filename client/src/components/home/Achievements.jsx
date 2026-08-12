import { achievements } from "../../data/resumeData";

export default function Achievements() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="font-heading font-bold text-3xl text-slate mb-10">
        Achievements
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border">
        {achievements.map((item) => (
          <div key={item.label} className="bg-surface px-5 py-6">
            <p className="font-heading font-extrabold text-xl text-slate">
              {item.value}
            </p>
            <p className="text-text-muted text-sm mt-1.5 leading-snug">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
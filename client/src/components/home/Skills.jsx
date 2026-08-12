import { skills } from "../../data/resumeData";

export default function Skills() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="font-heading font-bold text-3xl text-slate mb-10">
        Skills & Expertise
      </h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {skills.map((group) => (
          <div
            key={group.category}
            className="bg-surface border border-border rounded-xl p-6"
          >
            <p className="text-accent text-xs font-semibold tracking-wide uppercase mb-4">
              {group.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="bg-bg border border-border text-slate text-sm px-3 py-1.5 rounded-lg"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
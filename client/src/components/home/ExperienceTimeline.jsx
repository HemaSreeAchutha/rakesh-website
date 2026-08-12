import { experience } from "../../data/resumeData";

export default function ExperienceTimeline() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="font-heading font-bold text-3xl text-slate mb-12">
        Research Experience
      </h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border hidden sm:block" />

        <div className="space-y-10">
          {experience.map((item) => (
            <div key={item.org} className="relative sm:pl-10">
              {/* Dot */}
              <div className="absolute left-0 top-2 w-[15px] h-[15px] rounded-full bg-accent border-4 border-bg hidden sm:block" />

              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-heading font-bold text-lg text-slate">
                  {item.org}
                </h3>
                <span className="text-text-muted text-sm">{item.period}</span>
              </div>

              <p className="text-text-muted text-sm mt-1">
                {item.role} · {item.location}
                {item.supervisor && <> · Supervised by {item.supervisor}</>}
              </p>

              <ul className="mt-4 space-y-2">
                {item.points.map((point, i) => (
                  <li
                    key={i}
                    className="text-text-muted text-sm leading-relaxed flex gap-3"
                  >
                    <span className="text-accent mt-[2px]">▸</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
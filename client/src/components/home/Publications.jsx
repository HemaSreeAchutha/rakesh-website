import { publications } from "../../data/resumeData";

export default function Publications() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="font-heading font-bold text-3xl text-slate mb-3">
        Publications
      </h2>

      <p className="text-text-muted mb-10 max-w-2xl">
        Peer-reviewed work in quantum many-body physics, quantum machine
        learning, and quantum natural language processing.
      </p>

      <div className="space-y-4">
        {publications.map((pub) => (
          <a
            key={pub.title}
            href={pub.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-surface border border-border rounded-xl p-6 hover:border-accent transition-colors group"
          >
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="bg-slate text-white text-xs font-semibold px-2.5 py-1 rounded">
                {pub.venueShort}
              </span>

              <span className="text-text-muted text-sm">
                {pub.year}
              </span>
            </div>

            <h3 className="font-heading font-bold text-slate leading-snug group-hover:text-accent transition-colors">
              {pub.title}
            </h3>

            <p className="text-text-muted text-sm mt-2">
              {pub.authors}
            </p>

            <p className="text-text-muted text-sm mt-1 italic">
              {pub.venue}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
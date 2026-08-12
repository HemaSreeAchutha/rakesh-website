export default function Footer() {
  return (
    <>
    <footer className="border-t border-border mt-24 bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-heading font-bold text-slate">Rakesh Achutha</p>
        <p className="text-sm text-text-muted">
          PhD Researcher, University of Cambridge &middot; Math Consultant &middot; Oxbridge Tutor
        </p>
        
          <a href="mailto:rakeshachutha@gmail.com"
          className="text-sm text-accent hover:text-accent-soft transition-colors font-medium"
          >
          rakeshachutha@gmail.com
        </a>
      </div>
      <p className="text-center text-xs text-text-muted pb-6">
        &copy; {new Date().getFullYear()} Rakesh Achutha. All rights reserved.
      </p>
    </footer>
    </>
  );
}
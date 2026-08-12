import { useState, useEffect } from "react";
import api from "../services/api";
import ClassCard from "../components/classes/ClassCard";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch {
      setError("Could not load classes. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-heading font-bold text-3xl text-slate">
        Live Classes &amp; Webinars
      </h1>
      <p className="text-text-muted mt-2 mb-12 max-w-2xl">
        Small-group sessions on olympiad problem solving, Oxbridge admissions,
        and topics in quantum computing. Reserve a seat and you'll receive a
        calendar invitation with the join link.
      </p>

      {loading ? (
        <p className="text-text-muted">Loading classes...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : classes.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-10 text-center">
          <p className="font-heading font-bold text-slate">
            No classes scheduled right now
          </p>
          <p className="text-text-muted text-sm mt-2">
            New sessions are added regularly — check back soon, or book a
            one-to-one consultation in the meantime.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {classes.map((session) => (
            <ClassCard
              key={session.id}
              session={session}
              onRegistered={loadClasses}
            />
          ))}
        </div>
      )}
    </div>
  );
}
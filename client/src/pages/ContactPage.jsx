import ContactForm from "../components/contact/ContactForm";

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-heading font-bold text-3xl text-slate">Get in Touch</h1>
      <p className="text-text-muted mt-2 mb-10 max-w-xl">
        Have a question about tutoring, consultation, or research collaboration?
        Send a message below.
      </p>
      <ContactForm />
    </div>
  );
}
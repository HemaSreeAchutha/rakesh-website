import BookingForm from "../components/booking/BookingForm";

export default function BookingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-heading font-bold text-3xl text-slate">
        Book a Consultation
      </h1>
      <p className="text-text-muted mt-2 mb-12 max-w-xl">
        Choose a time that works for you and tell me what you'd like to cover.
        I'll confirm and send a meeting link by email.
      </p>
      <BookingForm />
    </div>
  );
}
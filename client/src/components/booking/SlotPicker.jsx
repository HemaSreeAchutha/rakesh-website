export default function SlotPicker({ slots, selectedSlotId, onSelect }) {
  if (slots.length === 0) {
    return (
      <p className="text-text-muted text-sm">
        No slots are currently available. Please check back soon or use the contact form.
      </p>
    );
  }

  // Group slots by date
  const grouped = slots.reduce((acc, slot) => {
    const dateKey = new Date(slot.start_time).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(slot);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, dateSlots]) => (
        <div key={date}>
          <p className="text-sm font-semibold text-slate mb-3">{date}</p>
          <div className="flex flex-wrap gap-3">
            {dateSlots.map((slot) => {
              const isSelected = slot.id === selectedSlotId;
              const time = new Date(slot.start_time).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onSelect(slot.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                    isSelected
                      ? "bg-accent border-accent text-white"
                      : "bg-surface border-border text-slate hover:border-slate"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
const formatSlot = (start) =>
  new Date(start).toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

exports.clientBookingConfirmation = ({ name, topic, startTime }) => ({
  subject: "Your consultation request has been received",
  html: `
    <h2>Thank you, ${name}!</h2>
    <p>I've received your consultation request. Here are the details:</p>
    <ul>
      <li><strong>Topic:</strong> ${topic}</li>
      <li><strong>Requested time:</strong> ${formatSlot(startTime)}</li>
    </ul>
    <p>I'll confirm shortly and send you a meeting link.</p>
    <p>— Rakesh Achutha</p>
  `,
});

exports.adminBookingAlert = ({ name, email, topic, notes, startTime }) => ({
  subject: `New booking: ${topic} — ${name}`,
  html: `
    <h3>New Consultation Booking</h3>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Topic:</strong> ${topic}</li>
      <li><strong>Time:</strong> ${formatSlot(startTime)}</li>
      <li><strong>Notes:</strong> ${notes || "—"}</li>
    </ul>
  `,
});

exports.meetingLinkEmail = ({ name, topic, startTime, meetingLink }) => ({
  subject: "Your consultation is confirmed",
  html: `
    <h2>Confirmed, ${name}</h2>
    <p>Your session on <strong>${topic}</strong> is scheduled for <strong>${formatSlot(startTime)}</strong>.</p>
    <p><a href="${meetingLink}">Join the meeting</a></p>
    <p>See you then.</p>
    <p>— Rakesh Achutha</p>
  `,
});

exports.classRegistrationEmail = ({ name, title, startTime, meetingLink, price, currency }) => ({
  subject: `You're registered: ${title}`,
  html: `
    <h2>See you there, ${name}</h2>
    <p>You're registered for <strong>${title}</strong>.</p>
    <ul>
      <li><strong>When:</strong> ${formatSlot(startTime)}</li>
      ${meetingLink ? `<li><strong>Join link:</strong> <a href="${meetingLink}">${meetingLink}</a></li>` : ""}
      ${Number(price) > 0 ? `<li><strong>Fee:</strong> ${currency} ${price} — payment details to follow</li>` : ""}
    </ul>
    <p>A calendar invitation has been sent separately.</p>
    <p>— Rakesh Achutha</p>
  `,
});
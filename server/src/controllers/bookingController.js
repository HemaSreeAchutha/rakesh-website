const db = require("../config/db");
const transporter = require("../config/mailer");
const {
  clientBookingConfirmation,
  adminBookingAlert,
} = require("../utils/emailTemplates");

// GET /api/booking/slots
exports.getAvailableSlots = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, start_time, end_time
       FROM slots
       WHERE is_booked = FALSE AND start_time > NOW()
       ORDER BY start_time ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Fetch slots error:", error);
    res.status(500).json({ error: "Could not load available slots." });
  }
};

// POST /api/booking
exports.createBooking = async (req, res) => {
  const { slotId, name, email, topic, notes } = req.body;

  if (!slotId || !name || !email || !topic) {
    return res.status(400).json({ error: "Please fill in all required fields." });
  }

  const client = await db.connect();
  let slot;

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      "SELECT * FROM slots WHERE id = $1 AND is_booked = FALSE FOR UPDATE",
      [slotId]
    );

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "That slot is no longer available." });
    }

    slot = rows[0];

    await client.query(
      `INSERT INTO bookings (slot_id, name, email, topic, notes)
       VALUES ($1, $2, $3, $4, $5)`,
      [slotId, name, email, topic, notes || null]
    );

    await client.query("UPDATE slots SET is_booked = TRUE WHERE id = $1", [slotId]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create booking error:", error);
    return res.status(500).json({ error: "Could not complete booking. Please try again." });
  } finally {
    client.release();
  }

  // Emails are best-effort
  try {
    const clientMail = clientBookingConfirmation({
      name,
      topic,
      startTime: slot.start_time,
    });
    await transporter.sendMail({
      from: `"Rakesh Achutha" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: clientMail.subject,
      html: clientMail.html,
    });

    const adminMail = adminBookingAlert({
      name,
      email,
      topic,
      notes,
      startTime: slot.start_time,
    });
    await transporter.sendMail({
      from: `"Booking System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: adminMail.subject,
      html: adminMail.html,
    });
  } catch (emailError) {
    console.error("Booking saved, but email failed to send:", emailError);
  }

  res.status(201).json({ success: true, message: "Booking confirmed." });
};
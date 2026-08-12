const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const transporter = require("../config/mailer");
const { meetingLinkEmail } = require("../utils/emailTemplates");
const {
  createMeetingEvent,
  deleteMeetingEvent,
  createClassEvent,
} = require("../utils/googleCalendar");

// POST /api/admin/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const { rows } = await db.query("SELECT * FROM admins WHERE email = $1", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

// GET /api/admin/bookings
exports.getBookings = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT b.id, b.name, b.email, b.topic, b.notes, b.status,
              b.meeting_link, b.created_at,
              s.start_time, s.end_time
       FROM bookings b
       JOIN slots s ON b.slot_id = s.id
       ORDER BY s.start_time DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ error: "Could not load bookings." });
  }
};

// GET /api/admin/slots
exports.getAllSlots = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, start_time, end_time, is_booked
       FROM slots
       ORDER BY start_time ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Fetch slots error:", error);
    res.status(500).json({ error: "Could not load slots." });
  }
};

// POST /api/admin/slots
exports.createSlot = async (req, res) => {
  const { startTime, endTime } = req.body;

  if (!startTime || !endTime) {
    return res.status(400).json({ error: "Start and end time are required." });
  }

  if (new Date(endTime) <= new Date(startTime)) {
    return res.status(400).json({ error: "End time must be after start time." });
  }

  try {
    const { rows } = await db.query(
      "INSERT INTO slots (start_time, end_time) VALUES ($1, $2) RETURNING id",
      [startTime, endTime]
    );
    res.status(201).json({ id: rows[0].id, success: true });
  } catch (error) {
    console.error("Create slot error:", error);
    res.status(500).json({ error: "Could not create slot." });
  }
};

// DELETE /api/admin/slots/:id
exports.deleteSlot = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT is_booked FROM slots WHERE id = $1", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Slot not found." });
    }

    if (rows[0].is_booked) {
      return res.status(409).json({
        error: "This slot has a booking. Cancel the booking first.",
      });
    }

    await db.query("DELETE FROM slots WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Delete slot error:", error);
    res.status(500).json({ error: "Could not delete slot." });
  }
};

// POST /api/admin/bookings/:id/confirm
exports.confirmBooking = async (req, res) => {
  const { meetingLink: manualLink } = req.body;

  try {
    const { rows } = await db.query(
      `SELECT b.*, s.start_time, s.end_time
       FROM bookings b
       JOIN slots s ON b.slot_id = s.id
       WHERE b.id = $1`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Booking not found." });
    }

    const booking = rows[0];
    let meetingLink = manualLink?.trim() || null;
    let eventId = booking.google_event_id;
    let warning = null;

    if (!meetingLink) {
      try {
        const event = await createMeetingEvent({
          name: booking.name,
          email: booking.email,
          topic: booking.topic,
          notes: booking.notes,
          startTime: booking.start_time,
          endTime: booking.end_time,
        });
        meetingLink = event.meetLink;
        eventId = event.eventId;
      } catch (calendarError) {
        console.error("Calendar event creation failed:", calendarError);
        return res.status(502).json({
          error:
            "Could not create the calendar event. Paste a meeting link manually, or check the Google connection.",
        });
      }
    }

    await db.query(
      `UPDATE bookings
       SET status = 'confirmed', meeting_link = $1, google_event_id = $2
       WHERE id = $3`,
      [meetingLink, eventId, req.params.id]
    );

    try {
      const mail = meetingLinkEmail({
        name: booking.name,
        topic: booking.topic,
        startTime: booking.start_time,
        meetingLink,
      });
      await transporter.sendMail({
        from: `"Rakesh Achutha" <${process.env.EMAIL_USER}>`,
        to: booking.email,
        subject: mail.subject,
        html: mail.html,
      });
    } catch (emailError) {
      console.error("Confirmed, but our email failed:", emailError);
      warning = "Confirmed and calendar invite sent, but the confirmation email failed.";
    }

    res.json({ success: true, meetingLink, warning });
  } catch (error) {
    console.error("Confirm booking error:", error);
    res.status(500).json({ error: "Could not confirm booking." });
  }
};

// POST /api/admin/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  const client = await db.connect();
  let googleEventId = null;

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      "SELECT slot_id, google_event_id FROM bookings WHERE id = $1",
      [req.params.id]
    );

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Booking not found." });
    }

    googleEventId = rows[0].google_event_id;

    await client.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = $1",
      [req.params.id]
    );

    await client.query("UPDATE slots SET is_booked = FALSE WHERE id = $1", [
      rows[0].slot_id,
    ]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Cancel booking error:", error);
    return res.status(500).json({ error: "Could not cancel booking." });
  } finally {
    client.release();
  }

  if (googleEventId) {
    try {
      await deleteMeetingEvent(googleEventId);
    } catch (calendarError) {
      console.error("Could not delete calendar event:", calendarError);
    }
  }

  res.json({ success: true });
};

// GET /api/admin/classes
exports.getAllClasses = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT c.*, COUNT(r.id)::int AS registered
       FROM class_sessions c
       LEFT JOIN registrations r ON r.class_id = c.id
       GROUP BY c.id
       ORDER BY c.start_time DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Fetch classes error:", error);
    res.status(500).json({ error: "Could not load classes." });
  }
};

// POST /api/admin/classes
exports.createClass = async (req, res) => {
  const { title, description, level, startTime, endTime, capacity, price, currency } = req.body;

  if (!title || !startTime || !endTime) {
    return res.status(400).json({ error: "Title, start time and end time are required." });
  }

  if (new Date(endTime) <= new Date(startTime)) {
    return res.status(400).json({ error: "End time must be after start time." });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO class_sessions
       (title, description, level, start_time, end_time, capacity, price, currency)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        title,
        description || null,
        level || null,
        startTime,
        endTime,
        capacity || 30,
        price || 0,
        currency || "GBP",
      ]
    );
    res.status(201).json({ id: rows[0].id, success: true });
  } catch (error) {
    console.error("Create class error:", error);
    res.status(500).json({ error: "Could not create class." });
  }
};

// POST /api/admin/classes/:id/publish
exports.publishClass = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM class_sessions WHERE id = $1", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Class not found." });
    }

    const session = rows[0];
    let meetingLink = session.meeting_link;
    let eventId = session.google_event_id;

    if (!eventId) {
      try {
        const event = await createClassEvent({
          title: session.title,
          description: session.description,
          startTime: session.start_time,
          endTime: session.end_time,
        });
        meetingLink = event.meetLink;
        eventId = event.eventId;
      } catch (calendarError) {
        console.error("Class calendar event failed:", calendarError);
        return res.status(502).json({
          error: "Could not create the Google Meet event. Check the Google connection.",
        });
      }
    }

    await db.query(
      `UPDATE class_sessions
       SET status = 'published', meeting_link = $1, google_event_id = $2
       WHERE id = $3`,
      [meetingLink, eventId, req.params.id]
    );

    res.json({ success: true, meetingLink });
  } catch (error) {
    console.error("Publish class error:", error);
    res.status(500).json({ error: "Could not publish class." });
  }
};

// GET /api/admin/classes/:id/registrations
exports.getClassRegistrations = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, name, email, payment_status, created_at
       FROM registrations
       WHERE class_id = $1
       ORDER BY created_at ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Fetch registrations error:", error);
    res.status(500).json({ error: "Could not load registrations." });
  }
};

// DELETE /api/admin/classes/:id
exports.deleteClass = async (req, res) => {
  try {
    await db.query("DELETE FROM class_sessions WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Delete class error:", error);
    res.status(500).json({ error: "Could not delete class." });
  }
};
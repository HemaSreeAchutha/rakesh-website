const db = require("../config/db");
const transporter = require("../config/mailer");
const { classRegistrationEmail } = require("../utils/emailTemplates");
const { addAttendeeToEvent } = require("../utils/googleCalendar");

// GET /api/classes
exports.getPublicClasses = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT c.id, c.title, c.description, c.level, c.start_time, c.end_time,
              c.capacity, c.price, c.currency,
              COUNT(r.id)::int AS registered
       FROM class_sessions c
       LEFT JOIN registrations r ON r.class_id = c.id
       WHERE c.status = 'published' AND c.start_time > NOW()
       GROUP BY c.id
       ORDER BY c.start_time ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Fetch classes error:", error);
    res.status(500).json({ error: "Could not load classes." });
  }
};

// POST /api/classes/:id/register
exports.registerForClass = async (req, res) => {
  const { name, email } = req.body;
  const classId = req.params.id;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const client = await db.connect();
  let session;

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      "SELECT * FROM class_sessions WHERE id = $1 AND status = 'published' FOR UPDATE",
      [classId]
    );

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Class not found." });
    }

    session = rows[0];

    if (new Date(session.start_time) <= new Date()) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "This class has already started." });
    }

    const countResult = await client.query(
      "SELECT COUNT(*)::int AS count FROM registrations WHERE class_id = $1",
      [classId]
    );

    if (countResult.rows[0].count >= session.capacity) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "This class is fully booked." });
    }

    await client.query(
      "INSERT INTO registrations (class_id, name, email) VALUES ($1, $2, $3)",
      [classId, name, email]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");

    // Postgres unique violation
    if (error.code === "23505") {
      client.release();
      return res.status(409).json({ error: "You're already registered for this class." });
    }

    console.error("Register error:", error);
    client.release();
    return res.status(500).json({ error: "Could not complete registration." });
  }

  client.release();

  if (session.google_event_id) {
    try {
      await addAttendeeToEvent(session.google_event_id, email);
    } catch (calendarError) {
      console.error("Could not add attendee to calendar event:", calendarError);
    }
  }

  try {
    const mail = classRegistrationEmail({
      name,
      title: session.title,
      startTime: session.start_time,
      meetingLink: session.meeting_link,
      price: session.price,
      currency: session.currency,
    });
    await transporter.sendMail({
      from: `"Rakesh Achutha" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: mail.subject,
      html: mail.html,
    });
  } catch (emailError) {
    console.error("Registered, but email failed:", emailError);
  }

  res.status(201).json({ success: true, message: "Registration confirmed." });
};
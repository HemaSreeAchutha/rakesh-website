const { calendar } = require("../config/google");

exports.createMeetingEvent = async ({
  name,
  email,
  topic,
  notes,
  startTime,
  endTime,
}) => {
  const event = {
    summary: `Consultation: ${topic}`,
    description: [
      `Consultation with ${name}`,
      notes ? `\nNotes from client:\n${notes}` : "",
    ].join(""),
    start: { dateTime: new Date(startTime).toISOString() },
    end: { dateTime: new Date(endTime).toISOString() },
    attendees: [{ email }],
    conferenceData: {
      createRequest: {
        requestId: `booking-${Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 30 },
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    requestBody: event,
    conferenceDataVersion: 1,
    sendUpdates: "all", // Google emails the invite to the client
  });

  return {
    eventId: response.data.id,
    meetLink: response.data.hangoutLink,
    htmlLink: response.data.htmlLink,
  };
};

exports.deleteMeetingEvent = async (eventId) => {
  await calendar.events.delete({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    eventId,
    sendUpdates: "all",
  });
};

exports.createClassEvent = async ({ title, description, startTime, endTime }) => {
  const event = {
    summary: title,
    description: description || "",
    start: { dateTime: new Date(startTime).toISOString() },
    end: { dateTime: new Date(endTime).toISOString() },
    conferenceData: {
      createRequest: {
        requestId: `class-${Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 15 },
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    requestBody: event,
    conferenceDataVersion: 1,
  });

  return {
    eventId: response.data.id,
    meetLink: response.data.hangoutLink,
  };
};

exports.addAttendeeToEvent = async (eventId, email) => {
  const existing = await calendar.events.get({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    eventId,
  });

  const attendees = existing.data.attendees || [];

  // Don't add a duplicate
  if (attendees.some((a) => a.email === email)) return;

  await calendar.events.patch({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    eventId,
    requestBody: { attendees: [...attendees, { email }] },
    sendUpdates: "all",
  });
};
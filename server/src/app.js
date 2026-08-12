const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/booking", require("./routes/bookingRoutes"));
app.use("/api/classes", require("./routes/classRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/google", require("./routes/googleRoutes"));

module.exports = app;
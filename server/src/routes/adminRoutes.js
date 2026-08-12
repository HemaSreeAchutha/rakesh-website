const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  login,
  getBookings,
  getAllSlots,
  createSlot,
  deleteSlot,
  confirmBooking,
  cancelBooking,
  getAllClasses,
  createClass,
  publishClass,
  getClassRegistrations,
  deleteClass,
} = require("../controllers/adminController");

// Public
router.post("/login", login);

// Bookings
router.get("/bookings", auth, getBookings);
router.post("/bookings/:id/confirm", auth, confirmBooking);
router.post("/bookings/:id/cancel", auth, cancelBooking);

// Slots
router.get("/slots", auth, getAllSlots);
router.post("/slots", auth, createSlot);
router.delete("/slots/:id", auth, deleteSlot);

// Classes
router.get("/classes", auth, getAllClasses);
router.post("/classes", auth, createClass);
router.post("/classes/:id/publish", auth, publishClass);
router.get("/classes/:id/registrations", auth, getClassRegistrations);
router.delete("/classes/:id", auth, deleteClass);

module.exports = router;
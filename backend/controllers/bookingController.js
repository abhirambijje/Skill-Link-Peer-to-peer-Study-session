const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');

// @desc  Create a booking
// @route POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { tutorId, slotId } = req.body;

    const slot = await TimeSlot.findById(slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.status === 'booked')
      return res.status(400).json({ message: 'This slot is already booked' });

    const booking = await Booking.create({
      studentId: req.user.id,
      tutorId,
      slotId,
      date: new Date().toLocaleDateString(),
    });

    slot.status = 'booked';
    await slot.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all bookings for logged-in student
// @route GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ studentId: req.user.id })
      .populate('tutorId', 'name email')
      .populate('slotId', 'date time')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all bookings received as a tutor
// @route GET /api/bookings/tutor
const getTutorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tutorId: req.user.id })
      .populate('studentId', 'name email')
      .populate('slotId', 'date time')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Update booking status (completed / cancelled)
// @route PUT /api/bookings/:id
const updateBookingStatus = async (req, res) => {
  try {
    const { status, meetingLink } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (status) booking.status = status;
    if (meetingLink) booking.meetingLink = meetingLink;
    await booking.save();

    // If cancelled, free up the slot
    if (status === 'cancelled') {
      await TimeSlot.findByIdAndUpdate(booking.slotId, { status: 'available' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createBooking, getMyBookings, getTutorBookings, updateBookingStatus };

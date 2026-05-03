const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeSlot',
      required: true,
    },
    date: { type: String },
    status: {
      type: String,
      enum: ['booked', 'completed', 'cancelled'],
      default: 'booked',
    },
    meetingLink: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);

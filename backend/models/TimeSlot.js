const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
  {
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    status: {
      type: String,
      enum: ['available', 'booked'],
      default: 'available',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TimeSlot', timeSlotSchema);

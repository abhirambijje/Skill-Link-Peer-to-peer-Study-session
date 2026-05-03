const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    Review: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rating', ratingSchema);

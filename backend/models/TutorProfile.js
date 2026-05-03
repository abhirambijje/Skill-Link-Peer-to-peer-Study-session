const mongoose = require('mongoose');

const tutorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    subjects: [{ type: String, trim: true }],
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TutorProfile', tutorProfileSchema);

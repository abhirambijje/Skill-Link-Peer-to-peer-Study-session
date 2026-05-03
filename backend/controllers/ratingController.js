const Rating = require('../models/Rating');
const TutorProfile = require('../models/TutorProfile');

// @desc  Submit a rating for a tutor
// @route POST /api/ratings
const submitRating = async (req, res) => {
  try {
    const { tutorId, rating, Review, review } = req.body;

    if (!tutorId || !rating)
      return res.status(400).json({ message: 'tutorId and rating are required' });

    const alreadyRated = await Rating.findOne({ studentId: req.user.id, tutorId });
    if (alreadyRated)
      return res.status(400).json({ message: 'You have already rated this tutor' });

    await Rating.create({ studentId: req.user.id, tutorId, rating, Review: Review || review });

    // Recalculate average rating on TutorProfile
    const allRatings = await Rating.find({ tutorId });
    const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    await TutorProfile.findOneAndUpdate(
      { userId: tutorId },
      { rating: parseFloat(avg.toFixed(1)) }
    );

    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all ratings for a tutor (by tutorId = user id)
// @route GET /api/ratings/:tutorId
const getTutorRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ tutorId: req.params.tutorId })
      .populate('studentId', 'name')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitRating, getTutorRatings };

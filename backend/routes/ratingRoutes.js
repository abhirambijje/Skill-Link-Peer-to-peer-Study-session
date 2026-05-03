const express = require('express');
const router = express.Router();
const { submitRating, getTutorRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitRating);
router.get('/:tutorId', getTutorRatings);

module.exports = router;

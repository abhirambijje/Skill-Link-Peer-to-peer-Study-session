const express = require('express');
const router = express.Router();
const {
  createOrUpdateProfile,
  getAllTutors,
  getTutorById,
  getMyProfile,
  addSlot,
  getSlots,
  deleteSlot,
} = require('../controllers/tutorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllTutors);
router.get('/my-profile', protect, getMyProfile);
router.get('/:id', getTutorById);
router.get('/:id/slots', getSlots);
router.post('/profile', protect, createOrUpdateProfile);
router.post('/slots', protect, addSlot);
router.delete('/slots/:slotId', protect, deleteSlot);

module.exports = router;

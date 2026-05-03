const TutorProfile = require('../models/TutorProfile');
const TimeSlot = require('../models/TimeSlot');
const User = require('../models/User');

// @desc  Create or update tutor profile
// @route POST /api/tutors/profile
const createOrUpdateProfile = async (req, res) => {
  try {
    const { subjects, bio } = req.body;
    let profile = await TutorProfile.findOne({ userId: req.user.id });

    if (profile) {
      profile.subjects = subjects || profile.subjects;
      profile.bio = bio || profile.bio;
      await profile.save();
    } else {
      profile = await TutorProfile.create({ userId: req.user.id, subjects, bio });
      // Update user role to tutor
      await User.findByIdAndUpdate(req.user.id, { role: 'tutor' });
    }

    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all tutor profiles
// @route GET /api/tutors
const getAllTutors = async (req, res) => {
  try {
    const profiles = await TutorProfile.find().populate('userId', 'name email');
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get single tutor profile by profile ID
// @route GET /api/tutors/:id
const getTutorById = async (req, res) => {
  try {
    const profile = await TutorProfile.findById(req.params.id).populate('userId', 'name email');
    if (!profile) return res.status(404).json({ message: 'Tutor profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get my own tutor profile
// @route GET /api/tutors/my-profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({ userId: req.user.id }).populate('userId', 'name email');
    if (!profile) return res.status(404).json({ message: 'No profile found. Create one first.' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Add a time slot
// @route POST /api/tutors/slots
const addSlot = async (req, res) => {
  try {
    const { time } = req.body;
    if (!time)
      return res.status(400).json({ message: 'Time is required' });

    const slot = await TimeSlot.create({ tutorId: req.user.id, time });
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get available slots for a tutor
// @route GET /api/tutors/:id/slots
const getSlots = async (req, res) => {
  try {
    // :id here is the TutorProfile id, we need userId
    const profile = await TutorProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Tutor not found' });

    const slots = await TimeSlot.find({ tutorId: profile.userId, status: 'available' });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Delete a time slot
// @route DELETE /api/tutors/slots/:slotId
const deleteSlot = async (req, res) => {
  try {
    const slot = await TimeSlot.findById(req.params.slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.tutorId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await slot.deleteOne();
    res.json({ message: 'Slot deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrUpdateProfile,
  getAllTutors,
  getTutorById,
  getMyProfile,
  addSlot,
  getSlots,
  deleteSlot,
};

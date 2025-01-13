const JobPosition = require('../models/JobPosition');

// READ All Job Posisition
exports.getAllJobPosition = async (req, res) => {
  try {
    const jobposition = await JobPosition.find();
    res.status(200).json(jobposition);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
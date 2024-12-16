const JobLevelDescription = require('../models/JobLevelDescription');

// CREATE JobLevelDescription
exports.createJobLevelDescription = async (req, res) => {
  try {
    const newJobLevelDescription = new JobLevelDescription(req.body);
    const savedJobLevelDescription = await newJobLevelDescription.save();
    res.status(201).json(savedJobLevelDescription);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Gagal menambahkan job level description.' });
  }
};

// READ All JobLevelDescriptions
exports.getAllJobLevelDescriptions = async (req, res) => {
  try {
    const descriptions = await JobLevelDescription.find().populate('id_joblevel', 'joblevel_name');
    res.status(200).json(descriptions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ JobLevelDescription by ID
exports.getJobLevelDescriptionById = async (req, res) => {
  try {
    const description = await JobLevelDescription.findById(req.params.id).populate('joblevel_id');
    if (!description) {
      return res.status(404).json({ message: 'Job Level Description not found' });
    }
    res.status(200).json(description);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE JobLevelDescription
exports.updateJobLevelDescription = async (req, res) => {
  try {
    const updatedDescription = await JobLevelDescription.findByIdAndUpdate(req.body.id, req.body, { new: true });
    if (!updatedDescription) {
      return res.status(404).json({ message: 'Job Level Description not found' });
    }
    res.status(200).json(updatedDescription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE JobLevelDescription
exports.deleteJobLevelDescription = async (req, res) => {
  try {
    const deletedDescription = await JobLevelDescription.findByIdAndDelete(req.params.id);
    if (!deletedDescription) {
      return res.status(404).json({ message: 'Job Level Description not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

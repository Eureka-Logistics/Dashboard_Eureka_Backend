const JobLevel = require('../models/JobLevel');

// CREATE JobLevel
exports.createJobLevel = async (req, res) => {
  try {
    const newJobLevel = new JobLevel(req.body);
    const savedJobLevel = await newJobLevel.save();
    res.status(201).json(savedJobLevel);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Gagal menambahkan job level.' });
  }
};

// READ All JobLevels
exports.getAllJobLevels = async (req, res) => {
  try {
    const jobLevels = await JobLevel.find().populate('id_bu', 'bu_name'); // nama_bu adalah field yang ingin ditampilkan
    res.status(200).json(jobLevels);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ JobLevel by ID
exports.getJobLevelById = async (req, res) => {
  try {
    const jobLevel = await JobLevel.findById(req.params.id);
    if (!jobLevel) {
      return res.status(404).json({ message: 'Job Level not found' });
    }
    res.status(200).json(jobLevel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE JobLevel
exports.updateJobLevel = async (req, res) => {
  try {
    const updatedJobLevel = await JobLevel.findByIdAndUpdate(req.body.id, req.body, { new: true });
    if (!updatedJobLevel) {
      return res.status(404).json({ message: 'Job Level not found' });
    }
    res.status(200).json(updatedJobLevel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE JobLevel
exports.deleteJobLevel = async (req, res) => {
  try {
    const deletedJobLevel = await JobLevel.findByIdAndDelete(req.params.id);
    if (!deletedJobLevel) {
      return res.status(404).json({ message: 'Job Level not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

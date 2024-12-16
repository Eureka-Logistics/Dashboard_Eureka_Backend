const Designation = require('../models/Designation');

// CREATE Designation
exports.createDesignation = async (req, res) => {
  try {
    const newDesignation = new Designation(req.body);
    const savedDesignation = await newDesignation.save();
    res.status(201).json(savedDesignation);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Gagal menambahkan designation.' });
  }
};

// READ All Designations
exports.getAllDesignations = async (req, res) => {
  try {
    const designations = await Designation.find();
    res.status(200).json(designations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ Designation by ID
exports.getDesignationById = async (req, res) => {
  try {
    const designation = await Designation.findById(req.params.id);
    if (!designation) {
      return res.status(404).json({ message: 'Designation not found' });
    }
    res.status(200).json(designation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE Designation
exports.updateDesignation = async (req, res) => {
  try {
    const updatedDesignation = await Designation.findByIdAndUpdate(req.body.id, req.body, { new: true });
    if (!updatedDesignation) {
      return res.status(404).json({ message: 'Designation not found' });
    }
    res.status(200).json(updatedDesignation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE Designation
exports.deleteDesignation = async (req, res) => {
  try {
    const deletedDesignation = await Designation.findByIdAndDelete(req.params.id);
    if (!deletedDesignation) {
      return res.status(404).json({ message: 'Designation not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

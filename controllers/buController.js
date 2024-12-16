const BU = require('../models/BU');

// CREATE BU
exports.createBU = async (req, res) => {
  try {
    const newBU = new BU(req.body);
    const savedBU = await newBU.save();
    res.status(201).json(savedBU);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Gagal menambahkan BU.' });
  }
};

// READ All BUs
exports.getAllBUs = async (req, res) => {
  try {
    const bus = await BU.find();
    res.status(200).json(bus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ BU by ID
exports.getBUById = async (req, res) => {
  try {
    const bu = await BU.findById(req.params.id);
    if (!bu) {
      return res.status(404).json({ message: 'BU not found' });
    }
    res.status(200).json(bu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE BU
exports.updateBU = async (req, res) => {
  try {
    const updatedBU = await BU.findByIdAndUpdate(req.body.id, req.body, { new: true });
    if (!updatedBU) {
      return res.status(404).json({ message: 'BU not found' });
    }
    res.status(200).json(updatedBU);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE BU
exports.deleteBU = async (req, res) => {
  try {
    const deletedBU = await BU.findByIdAndDelete(req.params.id);
    if (!deletedBU) {
      return res.status(404).json({ message: 'BU not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

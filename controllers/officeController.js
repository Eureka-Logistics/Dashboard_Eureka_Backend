const Office = require('../models/Office');

// CREATE Office
exports.createOffice = async (req, res) => {
  try {
    const newOffice = new Office(req.body);
    const savedOffice = await newOffice.save();
    res.status(201).json(savedOffice);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Gagal menambahkan office.' });
  }
};

// READ All Offices
exports.getAllOffices = async (req, res) => {
  try {
    const offices = await Office.find();
    res.status(200).json(offices);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ Office by ID
exports.getOfficeById = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id);
    if (!office) {
      return res.status(404).json({ message: 'Office not found' });
    }
    res.status(200).json(office);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE Office
exports.updateOffice = async (req, res) => {
  try {
    const updatedOffice = await Office.findByIdAndUpdate(req.body.id, req.body, { new: true });
    if (!updatedOffice) {
      return res.status(404).json({ message: 'Office not found' });
    }
    res.status(200).json(updatedOffice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE Office
exports.deleteOffice = async (req, res) => {
  try {
    const deletedOffice = await Office.findByIdAndDelete(req.params.id);
    if (!deletedOffice) {
      return res.status(404).json({ message: 'Office not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const Cabinet = require('../models/Cabinet');

// CREATE Cabinet
exports.createCabinet = async (req, res) => {
  try {
    if (!req.body.cabinet_name || !req.body.id_office) {
      return res.status(400).json({ error: 'cabinet_name, and id_office are required.' });
    }

    const newCabinet = new Cabinet(req.body);
    const savedCabinet = await newCabinet.save();
    const populatedCabinet = await savedCabinet.populate('id_office', 'office_name').execPopulate();

    res.status(201).json(populatedCabinet);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Gagal menambahkan cabinet.' });
  }
};

// READ All Cabinets
exports.getAllCabinets = async (req, res) => {
  try {
    const cabinets = await Cabinet.find().populate('id_office', 'office_name');
    res.status(200).json(cabinets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ Cabinet by ID
exports.getCabinetById = async (req, res) => {
  try {
    const cabinet = await Cabinet.findById(req.params.id).populate('id_office', 'office_name');
    if (!cabinet) {
      return res.status(404).json({ message: 'Cabinet not found' });
    }
    res.status(200).json(cabinet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE Cabinet
exports.updateCabinet = async (req, res) => {
  try {
    const updatedCabinet = await Cabinet.findByIdAndUpdate(req.body.id, req.body, { new: true })
      .populate('id_office', 'office_name');
    if (!updatedCabinet) {
      return res.status(404).json({ message: 'Cabinet not found' });
    }
    res.status(200).json(updatedCabinet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE Cabinet
exports.deleteCabinet = async (req, res) => {
  try {
    const deletedCabinet = await Cabinet.findByIdAndDelete(req.params.id);
    if (!deletedCabinet) {
      return res.status(404).json({ message: 'Cabinet not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

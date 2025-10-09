const Candidate = require('../models/Candidate');
const mongoose = require('mongoose');

// CREATE Candidate
exports.createCandidate = async (req, res) => {
  try {
    // Combine all data from body with additional fields
    const candidateData = {
      ...req.body,
      date_modified: new Date(),
    };

    // Ensure array data remains as arrays
    candidateData.workHistory = req.body.workHistory || [];
    candidateData.socialActivities = req.body.socialActivities || [];
    candidateData.education = req.body.education || [];
    candidateData.courses = req.body.courses || [];
    candidateData.others = {
      emergency_relations: req.body.others?.emergency_relations || [],
      former_relations: req.body.others?.former_relations || [],
      guarantors: req.body.others?.guarantors || [],
    };

    // Create new Candidate instance
    const newCandidate = new Candidate(candidateData);
    const savedCandidate = await newCandidate.save();

    res.status(201).json({
      status: 'success',
      message: 'Candidate data saved successfully',
      data: savedCandidate,
    });
  } catch (error) {
    console.error('Error while creating candidate:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Failed to save candidate data. Please ensure all required fields are filled correctly.',
        details: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Failed to save candidate data. Duplicate entry found.',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'An error occurred while saving candidate data.',
    });
  }
};

// READ All Candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .sort({ date_added: -1 })
      .lean();

    res.status(200).json({
      status: 'success',
      count: candidates.length,
      data: candidates,
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching candidates.',
    });
  }
};

// GET Candidate by ID
exports.getCandidateById = async (req, res) => {
  try {
    const idInput = req.params.id;
    const isObjectId = mongoose.Types.ObjectId.isValid(idInput);

    // Use flexible match condition
    const matchCondition = isObjectId
      ? { _id: new mongoose.Types.ObjectId(idInput) }
      : { _id: idInput };

    const candidate = await Candidate.findOne(matchCondition).lean();

    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: candidate,
    });
  } catch (error) {
    console.error('Error fetching candidate by ID:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching candidate.',
    });
  }
};

// UPDATE Candidate
exports.updateCandidate = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    // Ensure arrays remain as arrays
    updateData.workHistory = req.body.workHistory || [];
    updateData.socialActivities = req.body.socialActivities || [];
    updateData.education = req.body.education || [];
    updateData.courses = req.body.courses || [];
    updateData.others = {
      emergency_relations: req.body.others?.emergency_relations || [],
      former_relations: req.body.others?.former_relations || [],
      guarantors: req.body.others?.guarantors || [],
    };

    // Add date_modified
    updateData.date_modified = new Date();

    const updatedCandidate = await Candidate.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCandidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Candidate updated successfully',
      data: updatedCandidate,
    });
  } catch (error) {
    console.error('Error while updating candidate:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating candidate.',
    });
  }
};

// DELETE Candidate
exports.deleteCandidate = async (req, res) => {
  try {
    const deletedCandidate = await Candidate.findByIdAndDelete(req.params.id);
    
    if (!deletedCandidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Candidate deleted successfully',
    });
  } catch (error) {
    console.error('Error while deleting candidate:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while deleting candidate.',
    });
  }
};

// GET Candidates by Status
exports.getCandidatesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    const candidates = await Candidate.find({ applicationStatus: status })
      .sort({ date_added: -1 })
      .lean();

    res.status(200).json({
      status: 'success',
      count: candidates.length,
      data: candidates,
    });
  } catch (error) {
    console.error('Error fetching candidates by status:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching candidates by status.',
    });
  }
};

// UPDATE Candidate Status
exports.updateCandidateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { applicationStatus, interviewDate, interviewStatus } = req.body;

    const updateData = {
      date_modified: new Date(),
    };

    if (applicationStatus) updateData.applicationStatus = applicationStatus;
    if (interviewDate) updateData.interviewDate = interviewDate;
    if (interviewStatus) updateData.interviewStatus = interviewStatus;

    const updatedCandidate = await Candidate.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCandidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Candidate status updated successfully',
      data: updatedCandidate,
    });
  } catch (error) {
    console.error('Error while updating candidate status:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating candidate status.',
    });
  }
};

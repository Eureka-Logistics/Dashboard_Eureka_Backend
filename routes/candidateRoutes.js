const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

// POST /candidates - Create new candidate
router.post('/add', candidateController.createCandidate);

// GET /candidates - Get all candidates
router.get('/', candidateController.getAllCandidates);

// GET /candidates/status/:status - Get candidates by status
router.get('/status/:status', candidateController.getCandidatesByStatus);

// GET /candidates/:id - Get candidate by ID
router.get('/:id', candidateController.getCandidateById);

// PUT /candidates/:id - Update candidate
router.put('/:id', candidateController.updateCandidate);

// PATCH /candidates/:id/status - Update candidate status
router.patch('/:id/status', candidateController.updateCandidateStatus);

// DELETE /candidates/:id - Delete candidate
router.delete('/:id', candidateController.deleteCandidate);

module.exports = router;

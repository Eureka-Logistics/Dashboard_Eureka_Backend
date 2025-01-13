const express = require('express');
const router = express.Router();
const { getAllJobPosition } = require('../controllers/jobPositionController');
// const { authenticateToken } = require('../middlewares/authenticateToken');

router.get('/', getAllJobPosition);

module.exports = router;

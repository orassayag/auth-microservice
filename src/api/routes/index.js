const express = require('express');

const router = express.Router();

// Test the status to verify if online and working.
router.get('/status', (req, res) => { res.status(200).send('OK'); });

module.exports = router;
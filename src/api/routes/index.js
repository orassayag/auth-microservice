const express = require('express');
const userRoute = require('./user.route');

const router = express.Router();

// Test the status to verify if online and working.
router.get('/status', (req, res) => {
    res.status(200).send('OK');
});

// Set all routes.
router.use('/users', userRoute);

module.exports = router;
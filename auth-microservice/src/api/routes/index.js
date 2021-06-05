const express = require('express');
const authRoute = require('./files/auth.route');
const userRoute = require('./files/user.route');

const router = express.Router();

// Test the status to verify if online and working.
router.get('/status', (req, res) => {
    res.status(200).send('OK');
});

// Set all the routes.
router.use('/auth', authRoute);
router.use('/users', userRoute);

module.exports = router;
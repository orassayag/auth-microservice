// Set Bluebird promise to be the default promise.
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const logger = require('./config/logger.config');
const { errorHandler } = require('./config/error.config');
// Set all errors handling.
errorHandler();
const { port, env } = require('./config/vars.config');
const mongoose = require('./config/mongoose.config');
const app = require('./config/express.config');

// Open the Mongoose connection.
mongoose.connect();

// Initiate the server.
const server = app.listen(3001, () => logger.info(`Server started on port ${port} in ${env}.`));

// Setting gracefully shutting down in case of error.
const shutDown = () => {
    // Close all express servers.
    logger.info('Received kill signal, shutting down gracefully.');
    server.close(() => {
        logger.info('Closed out remaining connections.');
        process.exit(0);
    });
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down.');
        process.exit(1);
    }, 10000);
    // Close MongoDB connection.
    mongoose.closeConnection();
};
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

module.exports = app;
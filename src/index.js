// Make bluebird default Promise.
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const logger = require('./config/logger.config');
// Set error handling.
require('./config/error.config')();
const { port, env } = require('./config/vars.config');
const app = require('./config/express.config');

// Open the mongoose connection.
mongoose.connect();

// Initiate the server.
const server = app.listen(port, () => logger.info(`Server started on port ${port} (${env}).`));
if (env === 'development') {
    // Setting gracefully shutting down in case of error (Good for development).
    const shutDown = () => {
        logger.info('Received kill signal, shutting down gracefully.');
        server.close(() => {
            logger.info('Closed out remaining connections.');
            process.exit(0);
        });
        setTimeout(() => {
            logger.error('Could not close connections in time, forcefully shutting down.');
            process.exit(1);
        }, 10000);
    };
    process.on('SIGTERM', shutDown);
    process.on('SIGINT', shutDown);
}

module.exports = app;
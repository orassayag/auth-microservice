const httpStatus = require('http-status');

// API Error class. Will be return to the user in case
// of expected or standard error.

class APIErrorUtils extends Error {

    constructor(error) {
        const { message, errors, status, isPublic, stack } = error;
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.errors = errors;
        this.status = status || httpStatus.INTERNAL_SERVER_ERROR;
        this.isPublic = isPublic || false;
        this.isOperational = true; // This is required since Bluebird 4 doesn't append it anymore.
        this.stack = stack;
    }
}

module.exports = APIErrorUtils;
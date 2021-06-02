// Make bluebird default Promise.
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env } = require('./config/vars');

console.log(`hello world: ${port} ${env}`);
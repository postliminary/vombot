const sign = require('./sign');

module.exports = function(version, timestamp, body) {
    return `${version}=${sign(`${version}:${timestamp}:${body}`)}`;
};

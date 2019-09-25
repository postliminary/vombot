const crypto = require('crypto');
const log = require('../utils/log').logger;

module.exports = function(data) {
    log('Signing data', data);
    const hmac = crypto.createHmac('sha256', process.env['SLACK_SIGNING_SECRET']);
    hmac.update(data);
    const signed = hmac.digest('hex');
    log('Signed data', signed);
    return signed;
};

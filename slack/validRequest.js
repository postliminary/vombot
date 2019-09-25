const crypto = require('crypto');
const getSigningSecret = require('./getSigningSecret');
const log = require('../utils/log').logger;

module.exports = function(req) {
    log('Validating request', req);

    const timestamp = parseInt(req.headers['x-slack-request-timestamp'], 10);
    if (Math.abs(Date.now() / 1000 - timestamp) > 60 * 5) {
        log('Command request happened a long time ago', timestamp);
        return false;
    }

    const signingSecret = getSigningSecret('v0', timestamp, req.body);
    if (!crypto.timingSafeEqual(Buffer.from(signingSecret), Buffer.from(req.headers['x-slack-signature'] || ''))) {
        log('Signing secret does not match', signingSecret);
        return false;
    }

    return true;
};

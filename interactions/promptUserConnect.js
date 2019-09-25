const log = require('../utils/log').logger;
const getSigningSecret = require('../slack/getSigningSecret');
const getAuthorizeUrl = require('../slack/getAuthorizeUrl');
const JsonResult = require('../utils/JsonResult');
const saveUser = require('../repositories/saveUser');

module.exports = async function(command) {
    log('Prompting user to connect');

    // Create nonce
    const slackId = command.payload.user_id;
    const teamId = command.payload.team_id;
    const slackNonce = getSigningSecret('v0', Date.now(), slackId);

    // Generate authorize url
    const authorizeUrl = getAuthorizeUrl(teamId, slackNonce);

    // Save user
    await saveUser({
        slackId,
        slackToken: null,
        slackNonce,
    });

    // Create response
    return JsonResult({
        text: `<${authorizeUrl}|Click here to connect>`,
    })
};

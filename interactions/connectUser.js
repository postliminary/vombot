const log = require('../utils/log').logger;
const OkResult = require('../utils/OkResult');
const ErrorResult = require('../utils/ErrorResult');
const NotFoundResult = require('../utils/NotFoundResult');
const getUser = require('../repositories/getUser').bySlackNonce;
const saveUser = require('../repositories/saveUser');
const getAccessToken = require('../slack/getAccessToken');

const okMessage = [
    'You are now able to /vom in Slack!',
    '',
    '             %%%%%%',
    '            %%%% = =',
    '            %%C    >',
    '             _)\' _( .\' ,',
    '          __/ |_/\\   " *. o',
    '         /` \\_\\ \\/     %`= \'_  .',
    '        /  )   \\/|      .^\',*. ,',
    '       /\' /-   o/       - " % \'_',
    '      /\\_/     <       = , ^ ~ .',
    '      )_o|----\'|          .`  \'',
    '  ___// (_  - (\\',
    ' ///-(    \\\'   \\\\',
].join('\n');

module.exports = async function(params) {
    log('Connecting user');

    const {
        code,
        state,
    } = params;

    const user = await getUser(state);
    if (!user) {
        return NotFoundResult('Could not find user.');
    }

    const token = await getAccessToken(code);
    if (!token) {
        return ErrorResult('Could not connect user.');
    }

    // Save user
    await saveUser({
        ...user,
        slackAccessToken: token,
        slackNonce: null,
    });

    // Create response
    return OkResult(okMessage);
};

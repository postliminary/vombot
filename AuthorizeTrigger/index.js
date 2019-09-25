const log = require('../utils/log').logger;
const setLog = require('../utils/log').set;
const connectUser = require('../interactions/connectUser');

module.exports = async function(context, req) {
    setLog(context.log);

    log('Processing authorization request.', req);

    context.res = await connectUser(req.query);
};

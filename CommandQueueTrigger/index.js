const log = require('../utils/log').logger;
const setLog = require('../utils/log').set;
const addReactions = require('../interactions/addReactions');
const CommandType = require('../constants/commandType');

module.exports = async function(context, message) {
    setLog(context.log);

    log('Processing slash command.', message);

    if (message.type === CommandType.LastUserMessage) {
        await addReactions(message);
    }
};

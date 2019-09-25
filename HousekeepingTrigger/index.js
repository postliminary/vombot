const log = require('../utils/log').logger;
const setLog = require('../utils/log').set;
const updateEmojis = require('../interactions/updateEmojis');

module.exports = async function (context, timer) {
    setLog(context.log);

    if (timer.IsPastDue)
    {
        log('Housekeeping is running late!');
    }

    await updateEmojis();

    context.done();
};

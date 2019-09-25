const log = require('../utils/log').logger;
const getUser = require('../repositories/getUser').bySlackId;
const getMessages = require('../slack/getMessages');
const addReaction = require('../slack/addReaction');

module.exports = async function(command) {
    // TODO Clean this payload searching up
    const user = await getUser(command.payload.user_id);
    if (!(user && user.slackAccessToken)) {
        log('User is not connected');
        // TODO Attempt post message here
    }

    const messages = await getMessages({
        channel: command.payload.channel_id,
        count: 1000,
    }, user.slackAccessToken);
    if (!(messages && messages.length)) {
        log('Could not find any messages');
        // TODO Attempt to post message here
    }

    const targetMarker = `<@${command.args.target}>`;
    const message = messages.find(m => m.user === command.args.target || m.text.includes(targetMarker));
    if (!message) {
        log('Could not find a message for the user');
        // TODO Attempt to post message here
    }

    // TODO Get list of emojis
    const added = await addReaction({
        name: 'thumbsup',
        channel: command.payload.channel_id,
        timestamp: message.ts,
    }, user.slackAccessToken);
};

const log = require('../utils/log').logger;
const getUser = require('../repositories/getUser').bySlackId;
const getRandomEmojis = require('../repositories/getRandomEmojis');
const getMessages = require('../slack/getMessages');
const addReaction = require('../slack/addReaction');

const MaxReactionsPerMessage = 23;

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
    const message = messages && messages.find(m => m.user === command.args.target || m.text.includes(targetMarker));
    if (!message) {
        log('Could not find a message for the user');
        // TODO Attempt to post message here
    }

    const emojis = await getRandomEmojis(null, MaxReactionsPerMessage);
    let added = 0;
    for (let i = 0; i < emojis.length; i++) {
        const emoji = emojis[i];
        const success = await addReaction({
            name: emoji.code,
            channel: command.payload.channel_id,
            timestamp: message.ts,
        }, user.slackAccessToken);
        if (success) {
            added++;
        }
    }
    log('Added reactions', added);

    if (added) {
        // TODO Save user activity
    }
};

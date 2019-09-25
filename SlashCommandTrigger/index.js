const fetch = require('node-fetch');
const queryString = require('query-string');
const CommandType = require('../constants/commandType');
const log = require('../utils/log').logger;
const setLog = require('../utils/log').set;
const JsonResult = require('../utils/JsonResult');
const promptUserConnect = require('../interactions/promptUserConnect');
const helpUser = require('../interactions/helpUser');
const validRequest = require('../slack/validRequest');

module.exports = async function(context, req) {
    setLog(context.log);

    log('Processing slash command.');

    if (!validRequest(req)) {
        context.res = JsonResult({
            text: "Invalid request."
        });
        return;
    }

    const command = parseCommand(req);
    switch (command.type) {
        case CommandType.Connect:
            context.res = await promptUserConnect(command);
            break;
        case CommandType.Message:
            context.res = JsonResult({
                text: 'Voming on message...'
            });
            // Push to queue
            break;
        case CommandType.LastUserMessage:
            context.res = JsonResult({
                text: 'Voming on user...'
            });
            // Push to queue
            break;
        default:
            context.res = helpUser();
    }
};

async function processCommand(context, req) {
    const body = queryString.parse(req.body);
    log(body.text);

    /* Command args */
    const params = parseCommand(body.text || '');

    /* Validate */
    if (!params.subject) {
        return {
            text: 'You must vom at a user.'
        }
    }

    /* Get messages */
    try {
        log('api key', process.env['SLACK_API_TOKEN']);

        const response = await fetch(`https://slack.com/api/conversations.history?channel=${body.channel_id}`, {
            headers: {
                "Authorization": `Bearer ${process.env['SLACK_API_TOKEN']}`
            }
        });

        const data = await response.json();

        // TODO Custom find method
        data.messages.reverse();
        const message = data.messages.find(message => message.user === params.subject && !message.subtype);

        log(message);

        if (!message) {
            return {
                text: "Message for user not found."
            }
        }

        const payload = {
            name: 'thumbsup',
            channel: body.channel_id,
            timestamp: message.ts,
        };
        log(payload);
        const reaction = await fetch('https://slack.com/api/reactions.add', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${process.env['SLACK_API_TOKEN']}`
            }
        });

        const reactionReponse = await reaction.json();
        log(reactionReponse);

        return {
            text: `user: ${params.subject}, message: ${message.text}`
        }
    }
    catch (error) {
        log(error);

        return {
            text: "Something went wrong retrieving messages!"
        }
    }
}

function parseCommand(req) {
    log('Parsing command');

    const payload = queryString.parse(req.body);
    const tokens = payload.text
        .toLowerCase()
        .split(/\s+/);

    let type = 'help';
    let user = null;
    let limit = null;

    if (tokens.length === 1 && tokens[0] === 'connect') {
        type = CommandType.Connect;
    } else if (tokens.length > 1 && tokens[0] === 'message') {
        type = CommandType.Message;
        limit = tokens[1] && tryParseLimit(tokens[1]);
    } else if (tokens.length > 1 && (user = tryParseUser(tokens[0]))) {
        type = CommandType.LastUserMessage;
        limit = tokens[1] && tryParseLimit(tokens[1]);
    }

    return {
        type,
        user,
        limit,
        payload,
        tokens,
    };
}

function tryParseUser(token) {
    const match = token.match(/<@([a-z0-9]+)(\|.*?)?>/i);
    return match && match[1];
}

function tryParseLimit(token) {
    const match = token.match(/^[0-9]$/i);
    return match && parseInt(match[1], 10);
}

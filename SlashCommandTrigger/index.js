const fetch = require('node-fetch');
const queryString = require('query-string');

let log = () => {};

module.exports = async function (context, req) {
    log = context.log;

    log('Processing slash command.');

    const message = await processCommand(context, req);

    context.res = {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            ...message,
            'response_type': 'ephemeral',
            'attachments': [
                { 'text': req.body.text }
            ]
        }
    };
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

function parseCommand(text) {
    const tokens = text.split(/\s+/);
    log('Got tokens', tokens);

    return tokens.reduce((params, token) => {
        // Subject
        if (!params.subject) {
            const subject = tryParseSubject(token);
            if (subject)
                return {...params, subject};
        }

        // Limit
        if (!params.limit) {
            const limit = tryParseLimit(token);
            if (limit)
                return {...params, limit};
        }

        return params;
    }, {
        subject: null,
        limit: null,
    });
}

function tryParseSubject(token) {
    const match = token.match(/<@([a-z0-9]+)(\|.*?)?>/i);
    return match && match[1];
}

function tryParseLimit(token) {
    const match = token.match(/^[0-9]$/i);
    return match && parseInt(match[1], 10);
}

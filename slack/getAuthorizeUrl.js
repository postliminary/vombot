const queryString = require('querystring');

const scope = 'channels:history emoji:read reactions:write';

module.exports = function(team, nonce) {
    const query = {
        client_id: process.env['SLACK_CLIENT_ID'],
        redirect_url: process.env['SLACK_REDIRECT_URL'],
        scope,
        state: nonce,
        team,
    };

    return `https://slack.com/oauth/authorize?${queryString.stringify(query)}`;
};

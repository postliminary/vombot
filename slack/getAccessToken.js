const fetch = require('node-fetch');
const queryString = require('querystring');
const log = require('../utils/log').logger;

module.exports = async function(code) {
    log('Exchanging auth code for user access token');

    const payload = {
        client_id: process.env['SLACK_CLIENT_ID'],
        client_secret: process.env['SLACK_CLIENT_SECRET'],
        code,
        redirect_url: process.env['SLACK_REDIRECT_URL'],
    };

    try {
        const response = await fetch('https://slack.com/api/oauth.access', {
            method: 'POST',
            body: queryString.stringify(payload),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        const data = await response.json();
        log(data);
        return data.access_token;
    }
    catch (error) {
        log('Error getting user access token', error);
        return null;
    }
};

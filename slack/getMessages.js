const fetch = require('node-fetch');
const queryString = require('querystring');
const log = require('../utils/log').logger;

module.exports = async function(request, token) {
    log('Get latest messages in conversation');

    try {
        const response = await fetch(`https://slack.com/api/conversations.history?${queryString.stringify(request)}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data.messages;
    }
    catch (error) {
        log('Error getting messages', error);
        return null;
    }
};

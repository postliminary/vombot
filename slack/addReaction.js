const fetch = require('node-fetch');
const queryString = require('querystring');
const log = require('../utils/log').logger;

module.exports = async function(request, token) {
    log('Add reaction to message');

    try {
        const response = await fetch('https://slack.com/api/reactions.add', {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data.ok;
    }
    catch (error) {
        log('Error getting messages', error);
        return false;
    }
};

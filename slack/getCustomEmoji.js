const fetch = require('node-fetch');
const log = require('../utils/log').logger;

module.exports = async function(token) {
    log('Get custom emojis');

    try {
        const response = await fetch(`https://slack.com/api/emoji.list`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data.emoji;
    }
    catch (error) {
        log('Error getting emojis', error);
        return null;
    }
};

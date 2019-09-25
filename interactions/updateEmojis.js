const log = require('../utils/log').logger;
const getAccessToken = require('../repositories/getAccessToken');
const bulkUploadEmojis = require('../repositories/bulkUploadEmojis');
const getCustomEmoji = require('../slack/getCustomEmoji');
const StandardEmojis = require('../constants/standardEmojis');

module.exports = async function() {
    log('Update emojis');

    const token = await getAccessToken();
    if (!token) {
        log('Could not retrieve an access token');
        return;
    }

    const customEmoji = await getCustomEmoji(token);
    const customEmojis = customEmoji && Object.keys(customEmoji) || [];

    log('Adding custom emojis', customEmojis.length);
    const categorizedEmojis = {
        ...StandardEmojis,
        'custom': customEmojis,
    };

    // Flatten to emoji category pairs
    const emojis = [];
    Object.keys(categorizedEmojis).forEach(category => {
        categorizedEmojis[category].forEach(code => {
            emojis.push({ code, category })
        })
    });

    await bulkUploadEmojis(emojis);
};

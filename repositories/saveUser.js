const Request = require('tedious').Request;
const SqlTypes = require('tedious').TYPES;
const log = require('../utils/log').logger;
const getConnection = require('./getConnection');

module.exports = async function(user) {
    log('Saving user', user);

    const connection = await getConnection();
    return new Promise((resolve, reject) => {
        const sql = `
            IF EXISTS (SELECT 1 FROM Users WHERE SlackId = @SlackId)
            BEGIN
                UPDATE Users
                SET
                    SlackAccessToken = @SlackAccessToken,
                    SlackNonce = @SlackNonce
                WHERE SlackId = @SlackId
            END
            ELSE
            BEGIN
                INSERT INTO Users(
                    SlackId,
                    SlackAccessToken,
                    SlackNonce
                )
                VALUES (
                    @SlackId,
                    @SlackAccessToken,
                    @SlackNonce
                )
            END
        `;
        const finish = error => {
            if (error) {
                log('Error saving user', error);
                reject(error);
            } else {
                log('Saved user');
                resolve(null);
            }
        };

        const request = new Request(sql, finish);
        const {
            slackId,
            slackAccessToken,
            slackNonce,
        } = user;

        request.addParameter('SlackId', SqlTypes.VarChar, slackId);
        request.addParameter('SlackAccessToken', SqlTypes.VarChar, slackAccessToken);
        request.addParameter('SlackNonce', SqlTypes.VarChar, slackNonce);

        connection.execSql(request);
    });
};

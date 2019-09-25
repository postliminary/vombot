const Request = require('tedious').Request;
const SqlTypes = require('tedious').TYPES;
const log = require('../utils/log').logger;
const getConnection = require('./getConnection');

function getUser(field, value) {
    log('Retrieving user', field, value);

    return getConnection().then(connection => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    Id, 
                    SlackId, 
                    SlackAccessToken, 
                    SlackNonce 
                FROM Users 
                WHERE ${field} = @${field}
            `;
            const finish = (error, rowCount, rows) => {
                if (error) {
                    reject(error);
                } else {
                    const row = rows && rows[0];
                    const user = {
                        id: row[0].value,
                        slackId: row[1].value,
                        slackAccessToken: row[2].value,
                        slackNonce: row[3].value,
                    };
                    log('Retrieved user', user);
                    resolve(user);
                }
                connection.close();
            };

            const request = new Request(sql, finish);
            request.addParameter(field, SqlTypes.VarChar, value);

            connection.execSql(request);
        });
    });
}

module.exports = {
    bySlackId: slackId => getUser('SlackId', slackId),
    bySlackNonce: slackNonce => getUser('SlackNonce', slackNonce),
};

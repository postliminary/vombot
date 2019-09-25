const Request = require('tedious').Request;
const log = require('../utils/log').logger;
const getConnection = require('./getConnection');

module.exports = async function getAccessToken() {
    log('Finding a random access token');

    const connection = await getConnection();
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT TOP 1
                SlackAccessToken
            FROM Users 
            WHERE SlackAccessToken IS NOT NULL
            ORDER BY NEWID()
        `;
        const finish = (error, rowCount, rows) => {
            if (error) {
                reject(error);
            } else {
                const token = rows && rows[0] && rows[0][0].value;
                log('Retrieved token', token);
                resolve(token);
            }
            connection.close();
        };

        const request = new Request(sql, finish);
        connection.execSql(request);
    });
};
